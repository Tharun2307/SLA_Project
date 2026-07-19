package com.college.tickets.dto;

import jakarta.validation.constraints.NotBlank;

public class AssignTicketRequest {

    @NotBlank(message = "Assigned user ID is required")
    private String assignedToUserId;

    public AssignTicketRequest() {
    }

    public AssignTicketRequest(String assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public String getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(String assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }
}
