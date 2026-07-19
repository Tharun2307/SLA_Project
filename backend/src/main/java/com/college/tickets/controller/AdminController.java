package com.college.tickets.controller;

import com.college.tickets.dto.UpdateSettingsRequest;
import com.college.tickets.model.AppSettings;
import com.college.tickets.model.User;
import com.college.tickets.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable String id,
                                            @RequestBody Map<String, String> request) {
        try {
            String role = request.get("role");
            String departmentId = request.get("departmentId");
            User user = adminService.updateUserRole(id, role, departmentId);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/settings")
    public ResponseEntity<AppSettings> getSettings() {
        return ResponseEntity.ok(adminService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<AppSettings> updateSettings(@RequestBody UpdateSettingsRequest request) {
        return ResponseEntity.ok(adminService.updateSettings(request));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        return ResponseEntity.ok(adminService.getGlobalStats());
    }
}
