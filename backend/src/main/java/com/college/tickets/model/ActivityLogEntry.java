package com.college.tickets.model;

import java.time.Instant;

public class ActivityLogEntry {

    private String action;
    private String by;
    private Instant timestamp;
    private String notes;

    public ActivityLogEntry() {
    }

    public ActivityLogEntry(String action, String by, String notes) {
        this.action = action;
        this.by = by;
        this.timestamp = Instant.now();
        this.notes = notes;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getBy() {
        return by;
    }

    public void setBy(String by) {
        this.by = by;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
