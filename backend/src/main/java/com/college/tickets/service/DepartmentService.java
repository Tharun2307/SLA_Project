package com.college.tickets.service;

import com.college.tickets.model.Department;
import com.college.tickets.model.DepartmentName;
import com.college.tickets.model.Ticket;
import com.college.tickets.model.TicketStatus;
import com.college.tickets.model.User;
import com.college.tickets.repository.DepartmentRepository;
import com.college.tickets.repository.TicketRepository;
import com.college.tickets.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public DepartmentService(DepartmentRepository departmentRepository,
                             TicketRepository ticketRepository,
                             UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public List<Department> getLeaderboard() {
        return departmentRepository.findAllByOrderByHonorScoreDesc();
    }

    public Map<String, Object> getDepartmentStats(String departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found: " + departmentId));

        DepartmentName deptName = department.getName();
        List<Ticket> tickets = ticketRepository.findByCategory(deptName);

        long totalTickets = tickets.size();
        long openTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.OPEN).count();
        long inProgressTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.IN_PROGRESS).count();
        long resolvedTickets = tickets.stream()
                .filter(t -> t.getStatus() == TicketStatus.RESOLVED).count();

        // Calculate average resolution time
        double avgResolutionMinutes = tickets.stream()
                .filter(t -> t.getResolvedAt() != null)
                .mapToLong(t -> Duration.between(t.getCreatedAt(), t.getResolvedAt()).toMinutes())
                .average()
                .orElse(0.0);

        int teamSize = userRepository.findByDepartmentId(departmentId).size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("department", department);
        stats.put("totalTickets", totalTickets);
        stats.put("openTickets", openTickets);
        stats.put("inProgressTickets", inProgressTickets);
        stats.put("resolvedTickets", resolvedTickets);
        stats.put("avgResolutionMinutes", Math.round(avgResolutionMinutes));
        stats.put("teamSize", teamSize);

        return stats;
    }

    public List<User> getDepartmentMembers(String departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }
}
