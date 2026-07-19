package com.college.tickets.controller;

import com.college.tickets.model.Department;
import com.college.tickets.service.DepartmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        return ResponseEntity.ok(departmentService.getAllDepartments());
    }

    @GetMapping("/scores")
    public ResponseEntity<List<Department>> getLeaderboard() {
        return ResponseEntity.ok(departmentService.getLeaderboard());
    }

    @GetMapping("/{id}/stats")
    public ResponseEntity<Map<String, Object>> getDepartmentStats(@PathVariable String id) {
        return ResponseEntity.ok(departmentService.getDepartmentStats(id));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<com.college.tickets.model.User>> getDepartmentMembers(@PathVariable String id) {
        return ResponseEntity.ok(departmentService.getDepartmentMembers(id));
    }
}
