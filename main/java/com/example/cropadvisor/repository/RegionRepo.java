package com.example.cropadvisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cropadvisor.model.RegionModel;

public interface RegionRepo extends JpaRepository<RegionModel,Long>{

}
