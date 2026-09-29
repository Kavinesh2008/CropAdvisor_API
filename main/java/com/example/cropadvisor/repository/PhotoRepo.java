package com.example.cropadvisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cropadvisor.model.PhotoModel;

public interface PhotoRepo extends JpaRepository<PhotoModel,Long>{

}
