package com.example.cropadvisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cropadvisor.model.OfficerModel;

public interface OfficerRepo extends JpaRepository<OfficerModel,Long>{

}
