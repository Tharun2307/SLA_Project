package com.college.tickets.service;

import com.college.tickets.dto.UpdateSettingsRequest;
import com.college.tickets.model.*;
import com.college.tickets.repository.AppSettingsRepository;
import com.college.tickets.repository.DepartmentRepository;
import com.college.tickets.repository.TicketRepository;
import com.college.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;
    private final DepartmentRepository departmentRepository;
    private final AppSettingsRepository appSettingsRepository;

    public AdminService(UserRepository userRepository,
                        TicketRepository ticketRepository,
                        DepartmentRepository departmentRepository,
                        AppSettingsRepository appSettingsRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
        this.departmentRepository = departmentRepository;
        this.appSettingsRepository = appSettingsRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUserRole(String userId, String role, String departmentId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        user.setRole(Role.valueOf(role.toUpperCase()));
        if (departmentId != null) {
            user.setDepartmentId(departmentId);
        }

        return userRepository.save(user);
    }

    public AppSettings updateSettings(UpdateSettingsRequest request) {
        AppSettings settings = appSettingsRepository.findAll().stream()
                .findFirst()
                .orElse(AppSettings.defaults());

        if (request.getSlaHours() != null) {
            settings.setSlaHours(request.getSlaHours());
        }
        if (request.getRewardPoints() != null) {
            settings.setRewardPoints(request.getRewardPoints());
        }
        if (request.getPenaltyPoints() != null) {
            settings.setPenaltyPoints(request.getPenaltyPoints());
        }
        if (request.getPersonalRewardPoints() != null) {
            settings.setPersonalRewardPoints(request.getPersonalRewardPoints());
        }

        return appSettingsRepository.save(settings);
    }

    public AppSettings getSettings() {
        return appSettingsRepository.findAll().stream()
                .findFirst()
                .orElse(AppSettings.defaults());
    }

    public Map<String, Object> getGlobalStats() {
        List<Ticket> allTickets = ticketRepository.findAll();

        long totalTickets = allTickets.size();
        long openTickets = ticketRepository.countByStatus(TicketStatus.OPEN);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);

        double avgResolutionMinutes = allTickets.stream()
                .filter(t -> t.getResolvedAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes())
                .average()
                .orElse(0.0);

        long slaCompliant = allTickets.stream()
                .filter(t -> t.getResolvedAt() != null && t.getSlaDeadline() != null)
                .filter(t -> t.getResolvedAt().isBefore(t.getSlaDeadline()) || t.getResolvedAt().equals(t.getSlaDeadline()))
                .count();

        long totalResolved = allTickets.stream()
                .filter(t -> t.getResolvedAt() != null)
                .count();

        double slaComplianceRate = totalResolved > 0 ? (double) slaCompliant / totalResolved * 100 : 0;

        long totalUsers = userRepository.count();
        List<Department> departments = departmentRepository.findAllByOrderByHonorScoreDesc();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTickets", totalTickets);
        stats.put("openTickets", openTickets);
        stats.put("inProgressTickets", inProgressTickets);
        stats.put("resolvedTickets", resolvedTickets);
        stats.put("avgResolutionMinutes", Math.round(avgResolutionMinutes));
        stats.put("slaComplianceRate", Math.round(slaComplianceRate));
        stats.put("totalUsers", totalUsers);
        stats.put("departments", departments);

        return stats;
    }
}
