package com.example.cropadvisor.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity 
@Table (name="ticket")
public class TicketModel {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long ticket_id;
    @ManyToOne 
    @JoinColumn (name="farmer")
    private FarmerModel farmer;
    @ManyToOne 
    @JoinColumn (name="officer")
    private OfficerModel officer;
    private String crop_name;
    private String symptoms;
    private String status;
    private String recommendation;
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
    private LocalDateTime closed_at;
    private Boolean escalated;
    public Long getTicket_id() {
        return ticket_id;
    }
    public void setTicket_id(Long ticket_id) {
        this.ticket_id = ticket_id;
    }
    public FarmerModel getFarmer() {
        return farmer;
    }
    public void setFarmer(FarmerModel farmer) {
        this.farmer = farmer;
    }
    public OfficerModel getOfficer() {
        return officer;
    }
    public void setOfficer(OfficerModel officer) {
        this.officer = officer;
    }
    public String getCrop_name() {
        return crop_name;
    }
    public void setCrop_name(String crop_name) {
        this.crop_name = crop_name;
    }
    public String getSymptoms() {
        return symptoms;
    }
    public void setSymptoms(String symptoms) {
        this.symptoms = symptoms;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getRecommendation() {
        return recommendation;
    }
    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    public LocalDateTime getUpdated_at() {
        return updated_at;
    }
    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }
    public LocalDateTime getClosed_at() {
        return closed_at;
    }
    public void setClosed_at(LocalDateTime closed_at) {
        this.closed_at = closed_at;
    }
    public Boolean getEscalated() {
        return escalated;
    }
    public void setEscalated(Boolean escalated) {
        this.escalated = escalated;
    }
    
}
