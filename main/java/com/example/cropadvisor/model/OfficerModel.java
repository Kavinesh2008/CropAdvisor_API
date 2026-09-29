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
@Table (name="officer")
public class OfficerModel {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long officer_id;
    private String officer_name;
    private String email;
    private String phone;
    private String specialization;
    @ManyToOne 
    @JoinColumn (name="region")
    private RegionModel region;
    private Boolean active;
    private LocalDateTime created_at;
    public Long getOfficer_id() {
        return officer_id;
    }
    public void setOfficer_id(Long officer_id) {
        this.officer_id = officer_id;
    }
    public String getOfficer_name() {
        return officer_name;
    }
    public void setOfficer_name(String officer_name) {
        this.officer_name = officer_name;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getSpecialization() {
        return specialization;
    }
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    public RegionModel getRegion() {
        return region;
    }
    public void setRegion(RegionModel region) {
        this.region = region;
    }
    public Boolean getActive() {
        return active;
    }
    public void setActive(Boolean active) {
        this.active = active;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    
}
