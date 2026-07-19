package com.college.tickets.dto;

public class ResolveTicketRequest {

    private String resolutionNotes;

    public ResolveTicketRequest() {
    }

    public ResolveTicketRequest(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
