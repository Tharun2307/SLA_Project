package com.college.tickets.dto;

public class UpdateSettingsRequest {

    private Integer slaHours;
    private Integer rewardPoints;
    private Integer penaltyPoints;
    private Integer personalRewardPoints;

    public UpdateSettingsRequest() {
    }

    public Integer getSlaHours() {
        return slaHours;
    }

    public void setSlaHours(Integer slaHours) {
        this.slaHours = slaHours;
    }

    public Integer getRewardPoints() {
        return rewardPoints;
    }

    public void setRewardPoints(Integer rewardPoints) {
        this.rewardPoints = rewardPoints;
    }

    public Integer getPenaltyPoints() {
        return penaltyPoints;
    }

    public void setPenaltyPoints(Integer penaltyPoints) {
        this.penaltyPoints = penaltyPoints;
    }

    public Integer getPersonalRewardPoints() {
        return personalRewardPoints;
    }

    public void setPersonalRewardPoints(Integer personalRewardPoints) {
        this.personalRewardPoints = personalRewardPoints;
    }
}
