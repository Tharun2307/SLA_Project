package com.college.tickets.controller;

import com.college.tickets.dto.AssignTicketRequest;
import com.college.tickets.dto.CreateTicketRequest;
import com.college.tickets.dto.ResolveTicketRequest;
import com.college.tickets.dto.UpdateStatusRequest;
import com.college.tickets.model.*;
import com.college.tickets.security.CustomUserDetails;
import com.college.tickets.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<?> createTicket(@Valid @RequestBody CreateTicketRequest request,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Ticket ticket = ticketService.createTicket(request, userDetails.getUserId());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyAssignedTickets(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ticketService.getAssignedTickets(userDetails.getUserId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getTicketsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUser(userId));
    }

    @GetMapping("/department/{category}")
    public ResponseEntity<List<Ticket>> getTicketsByDepartment(@PathVariable String category) {
        try {
            DepartmentName deptName = DepartmentName.valueOf(category.toUpperCase());
            return ResponseEntity.ok(ticketService.getTicketsByCategory(deptName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/department/{category}/unassigned")
    public ResponseEntity<List<Ticket>> getUnassignedTickets(@PathVariable String category) {
        try {
            DepartmentName deptName = DepartmentName.valueOf(category.toUpperCase());
            return ResponseEntity.ok(ticketService.getUnassignedTickets(deptName));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTicketById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ticketService.getTicketById(id));
        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<?> assignTicket(@PathVariable String id,
                                          @Valid @RequestBody AssignTicketRequest request,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Ticket ticket = ticketService.assignTicket(id, request, userDetails.getUserId());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable String id,
                                          @Valid @RequestBody UpdateStatusRequest request,
                                          @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            TicketStatus status = TicketStatus.valueOf(request.getStatus().toUpperCase());
            Ticket ticket = ticketService.updateStatus(id, status, userDetails.getUserId());
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<?> resolveTicket(@PathVariable String id,
                                           @RequestBody ResolveTicketRequest request,
                                           @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            Map<String, Object> result = ticketService.resolveTicket(id, request, userDetails.getUserId());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return errorResponse(e.getMessage());
        }
    }

    private ResponseEntity<Map<String, String>> errorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("error", message);
        return ResponseEntity.badRequest().body(error);
    }
}
