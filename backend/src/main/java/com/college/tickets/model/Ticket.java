package com.college.tickets.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Document("tickets")
public class Ticket {

    @Id
    private String id;

    private String title;

    private String description;

    private DepartmentName category;

    private TicketStatus status;

    private Priority priority;

    private String raisedByUserId;

    private String assignedToUserId;

    private String resolvedByUserId;

    private Instant createdAt;

    private Instant slaDeadline;

    private Instant resolvedAt;

    private String resolutionNotes;

    private List<ActivityLogEntry> activityLog;

    public Ticket() {
        this.activityLog = new ArrayList<>();
    }

    public Ticket(String title, String description, DepartmentName category, Priority priority, String raisedByUserId) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.raisedByUserId = raisedByUserId;
        this.status = TicketStatus.OPEN;
        this.createdAt = Instant.now();
        this.activityLog = new ArrayList<>();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DepartmentName getCategory() {
        return category;
    }

    public void setCategory(DepartmentName category) {
        this.category = category;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getRaisedByUserId() {
        return raisedByUserId;
    }

    public void setRaisedByUserId(String raisedByUserId) {
        this.raisedByUserId = raisedByUserId;
    }

    public String getAssignedToUserId() {
        return assignedToUserId;
    }

    public void setAssignedToUserId(String assignedToUserId) {
        this.assignedToUserId = assignedToUserId;
    }

    public String getResolvedByUserId() {
        return resolvedByUserId;
    }

    public void setResolvedByUserId(String resolvedByUserId) {
        this.resolvedByUserId = resolvedByUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getSlaDeadline() {
        return slaDeadline;
    }

    public void setSlaDeadline(Instant slaDeadline) {
        this.slaDeadline = slaDeadline;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public List<ActivityLogEntry> getActivityLog() {
        return activityLog;
    }

    public void setActivityLog(List<ActivityLogEntry> activityLog) {
        this.activityLog = activityLog;
    }

    public void addActivityLog(ActivityLogEntry entry) {
        if (this.activityLog == null) {
            this.activityLog = new ArrayList<>();
        }
        this.activityLog.add(entry);
    }
}
