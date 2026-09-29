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
@Table (name="farmer")
public class FarmerModel {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long farmer_id;
    private String farmer_name;
    private String phone;
    private String email;
    private String address;
    @ManyToOne 
    @JoinColumn (name="region_id")
    private RegionModel region;
    private LocalDateTime created_at;
    public Long getFarmer_id() {
        return farmer_id;
    }
    public void setFarmer_id(Long farmer_id) {
        this.farmer_id = farmer_id;
    }
    public String getFarmer_name() {
        return farmer_name;
    }
    public void setFarmer_name(String farmer_name) {
        this.farmer_name = farmer_name;
    }
    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public RegionModel getRegion() {
        return region;
    }
    public void setRegion(RegionModel region) {
        this.region = region;
    }
    public LocalDateTime getCreated_at() {
        return created_at;
    }
    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }
    
}
