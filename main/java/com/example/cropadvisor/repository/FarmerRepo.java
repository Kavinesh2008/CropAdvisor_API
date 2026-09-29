package com.example.cropadvisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cropadvisor.model.FarmerModel;

public interface FarmerRepo extends JpaRepository<FarmerModel,Long>{

}
