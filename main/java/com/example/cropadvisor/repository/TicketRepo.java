package com.example.cropadvisor.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cropadvisor.model.TicketModel;

public interface TicketRepo extends JpaRepository<TicketModel,Long>{

}
