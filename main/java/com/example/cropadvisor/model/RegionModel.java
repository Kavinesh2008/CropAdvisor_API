package com.example.cropadvisor.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity 
@Table (name="region")
public class RegionModel {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long region_id;
    private String region_name;
    private String district;
    private String state;
    private String pin_code;
    public Long getRegion_id() {
        return region_id;
    }
    public void setRegion_id(Long region_id) {
        this.region_id = region_id;
    }
    public String getRegion_name() {
        return region_name;
    }
    public void setRegion_name(String region_name) {
        this.region_name = region_name;
    }
    public String getDistrict() {
        return district;
    }
    public void setDistrict(String district) {
        this.district = district;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getPin_code() {
        return pin_code;
    }
    public void setPin_code(String pin_code) {
        this.pin_code = pin_code;
    }
    
}
