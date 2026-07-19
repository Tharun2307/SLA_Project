package com.college.tickets.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("departments")
public class Department {

    @Id
    private String id;

    private DepartmentName name;

    private String headId;

    private int honorScore;

    private int totalRewards;

    private int totalPenalties;

    public Department() {
    }

    public Department(DepartmentName name) {
        this.name = name;
        this.honorScore = 100;
        this.totalRewards = 0;
        this.totalPenalties = 0;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public DepartmentName getName() {
        return name;
    }

    public void setName(DepartmentName name) {
        this.name = name;
    }

    public String getHeadId() {
        return headId;
    }

    public void setHeadId(String headId) {
        this.headId = headId;
    }

    public int getHonorScore() {
        return honorScore;
    }

    public void setHonorScore(int honorScore) {
        this.honorScore = honorScore;
    }

    public int getTotalRewards() {
        return totalRewards;
    }

    public void setTotalRewards(int totalRewards) {
        this.totalRewards = totalRewards;
    }

    public int getTotalPenalties() {
        return totalPenalties;
    }

    public void setTotalPenalties(int totalPenalties) {
        this.totalPenalties = totalPenalties;
    }
}
