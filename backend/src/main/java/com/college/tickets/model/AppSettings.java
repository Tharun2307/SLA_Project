package com.college.tickets.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("settings")
public class AppSettings {

    @Id
    private String id;

    private int slaHours;

    private int rewardPoints;

    private int penaltyPoints;

    private int personalRewardPoints;

    public AppSettings() {
    }

    public AppSettings(int slaHours, int rewardPoints, int penaltyPoints, int personalRewardPoints) {
        this.slaHours = slaHours;
        this.rewardPoints = rewardPoints;
        this.penaltyPoints = penaltyPoints;
        this.personalRewardPoints = personalRewardPoints;
    }

    public static AppSettings defaults() {
        return new AppSettings(4, 10, -5, 2);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getSlaHours() {
        return slaHours;
    }

    public void setSlaHours(int slaHours) {
        this.slaHours = slaHours;
    }

    public int getRewardPoints() {
        return rewardPoints;
    }

    public void setRewardPoints(int rewardPoints) {
        this.rewardPoints = rewardPoints;
    }

    public int getPenaltyPoints() {
        return penaltyPoints;
    }

    public void setPenaltyPoints(int penaltyPoints) {
        this.penaltyPoints = penaltyPoints;
    }

    public int getPersonalRewardPoints() {
        return personalRewardPoints;
    }

    public void setPersonalRewardPoints(int personalRewardPoints) {
        this.personalRewardPoints = personalRewardPoints;
    }
}
