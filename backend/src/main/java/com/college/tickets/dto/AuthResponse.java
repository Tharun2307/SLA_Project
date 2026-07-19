package com.college.tickets.dto;

public class AuthResponse {

    private String token;
    private String role;
    private String name;
    private String userId;
    private String departmentId;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role, String name, String userId, String departmentId, String email) {
        this.token = token;
        this.role = role;
        this.name = name;
        this.userId = userId;
        this.departmentId = departmentId;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
