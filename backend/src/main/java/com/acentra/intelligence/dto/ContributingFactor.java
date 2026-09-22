package com.acentra.intelligence.dto;

public class ContributingFactor {
    private String name;
    private int scoreImpact;
    private String detail;

    public ContributingFactor() {
    }

    public ContributingFactor(String name, int scoreImpact, String detail) {
        this.name = name;
        this.scoreImpact = scoreImpact;
        this.detail = detail;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScoreImpact() {
        return scoreImpact;
    }

    public void setScoreImpact(int scoreImpact) {
        this.scoreImpact = scoreImpact;
    }

    public String getDetail() {
        return detail;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }
}
