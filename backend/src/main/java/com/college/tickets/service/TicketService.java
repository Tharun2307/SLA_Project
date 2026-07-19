package com.college.tickets.service;

import com.college.tickets.dto.AssignTicketRequest;
import com.college.tickets.dto.CreateTicketRequest;
import com.college.tickets.dto.ResolveTicketRequest;
import com.college.tickets.model.*;
import com.college.tickets.repository.AppSettingsRepository;
import com.college.tickets.repository.DepartmentRepository;
import com.college.tickets.repository.TicketRepository;
import com.college.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AppSettingsRepository appSettingsRepository;

    public TicketService(TicketRepository ticketRepository,
                         UserRepository userRepository,
                         DepartmentRepository departmentRepository,
                         AppSettingsRepository appSettingsRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.appSettingsRepository = appSettingsRepository;
    }

    public Ticket createTicket(CreateTicketRequest request, String userId) {
        AppSettings settings = getSettings();
        DepartmentName category = DepartmentName.valueOf(request.getCategory().toUpperCase());
        Priority priority = Priority.valueOf(request.getPriority().toUpperCase());

        Ticket ticket = new Ticket(
                request.getTitle(),
                request.getDescription(),
                category,
                priority,
                userId
        );

        // Calculate SLA deadline
        ticket.setSlaDeadline(ticket.getCreatedAt().plus(Duration.ofHours(settings.getSlaHours())));

        // Add activity log
        ticket.addActivityLog(new ActivityLogEntry("CREATED", userId, "Ticket created"));

        return ticketRepository.save(ticket);
    }

    public Ticket assignTicket(String ticketId, AssignTicketRequest request, String assignedBy) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        // Verify the assigned user exists and is an EMPLOYEE or DEPT_HEAD
        User assignee = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new RuntimeException("User not found: " + request.getAssignedToUserId()));

        if (assignee.getRole() != Role.EMPLOYEE && assignee.getRole() != Role.DEPT_HEAD) {
            throw new RuntimeException("Can only assign tickets to EMPLOYEE or DEPT_HEAD users");
        }

        ticket.setAssignedToUserId(request.getAssignedToUserId());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.addActivityLog(new ActivityLogEntry("ASSIGNED", assignedBy,
                "Assigned to " + assignee.getName()));

        return ticketRepository.save(ticket);
    }

    public Ticket updateStatus(String ticketId, TicketStatus status, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        ticket.setStatus(status);
        ticket.addActivityLog(new ActivityLogEntry(status.name(), userId,
                "Status changed to " + status.name()));

        return ticketRepository.save(ticket);
    }

    /**
     * CORE GAMIFICATION LOGIC
     * Resolves a ticket and applies rewards or penalties based on SLA compliance.
     */
    public Map<String, Object> resolveTicket(String ticketId, ResolveTicketRequest request, String userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));

        if (ticket.getStatus() == TicketStatus.RESOLVED) {
            throw new RuntimeException("Ticket is already resolved");
        }

        AppSettings settings = getSettings();
        Instant now = Instant.now();

        // Update ticket
        ticket.setStatus(TicketStatus.RESOLVED);
        ticket.setResolvedAt(now);
        ticket.setResolvedByUserId(userId);
        ticket.setResolutionNotes(request.getResolutionNotes());
        ticket.addActivityLog(new ActivityLogEntry("RESOLVED", userId,
                request.getResolutionNotes() != null ? request.getResolutionNotes() : "Ticket resolved"));

        // Calculate time taken
        Duration timeTaken = Duration.between(ticket.getCreatedAt(), now);
        Duration slaLimit = Duration.ofHours(settings.getSlaHours());
        boolean onTime = timeTaken.compareTo(slaLimit) <= 0;

        // Get department
        Department department = departmentRepository.findByName(ticket.getCategory())
                .orElseThrow(() -> new RuntimeException("Department not found: " + ticket.getCategory()));

        // Get employee
        User employee = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Map<String, Object> result = new HashMap<>();

        if (onTime) {
            // REWARD: On-time resolution
            department.setHonorScore(department.getHonorScore() + settings.getRewardPoints());
            department.setTotalRewards(department.getTotalRewards() + 1);
            employee.setPersonalHonorScore(employee.getPersonalHonorScore() + settings.getPersonalRewardPoints());

            result.put("rewarded", true);
            result.put("pointsAwarded", settings.getRewardPoints());
            result.put("personalPoints", settings.getPersonalRewardPoints());
        } else {
            // PENALTY: Late resolution
            department.setHonorScore(department.getHonorScore() + settings.getPenaltyPoints());
            department.setTotalPenalties(department.getTotalPenalties() + 1);

            result.put("rewarded", false);
            result.put("pointsDeducted", Math.abs(settings.getPenaltyPoints()));
        }

        // Save all updates
        ticketRepository.save(ticket);
        departmentRepository.save(department);
        userRepository.save(employee);

        result.put("ticket", ticket);
        result.put("departmentHonorScore", department.getHonorScore());
        result.put("timeTakenMinutes", timeTaken.toMinutes());
        result.put("slaMinutes", slaLimit.toMinutes());

        return result;
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByUser(String userId) {
        return ticketRepository.findByRaisedByUserId(userId);
    }

    public List<Ticket> getAssignedTickets(String userId) {
        return ticketRepository.findByAssignedToUserId(userId);
    }

    public List<Ticket> getTicketsByCategory(DepartmentName category) {
        return ticketRepository.findByCategory(category);
    }

    public List<Ticket> getUnassignedTickets(DepartmentName category) {
        return ticketRepository.findByCategoryAndAssignedToUserIdIsNull(category);
    }

    public Ticket getTicketById(String ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found: " + ticketId));
    }

    private AppSettings getSettings() {
        return appSettingsRepository.findAll().stream()
                .findFirst()
                .orElse(AppSettings.defaults());
    }
}
