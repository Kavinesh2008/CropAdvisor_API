package com.example.cropadvisor.service;

import org.springframework.stereotype.Service;

import com.example.cropadvisor.model.TicketModel;
import com.example.cropadvisor.repository.TicketRepo;
import java.util.*;

@Service 
public class TicketServiceImpl implements TicketService{
    private final TicketRepo repo;
    public TicketServiceImpl(TicketRepo repo) {
        this.repo = repo;
    }
    @Override 
    public TicketModel create(TicketModel data)
    {
        return repo.save(data);
    }
    @Override 
    public List<TicketModel> getData()
    {
        return repo.findAll();
    }
    @Override 
    public TicketModel update(Long id,TicketModel data)
    {
        TicketModel exTicket = repo.findById(id).orElse(null);
        if(exTicket==null)
            return null;
        exTicket.setFarmer(data.getFarmer());
        exTicket.setOfficer(data.getOfficer());
        exTicket.setCrop_name(data.getCrop_name());
        exTicket.setSymptoms(data.getSymptoms());
        exTicket.setStatus(data.getStatus());
        exTicket.setRecommendation(data.getRecommendation());
        exTicket.setCreated_at(data.getCreated_at());
        exTicket.setUpdated_at(data.getUpdated_at());
        exTicket.setClosed_at(data.getClosed_at());
        exTicket.setEscalated(data.getEscalated());
        return repo.save(exTicket);
    }
    @Override
    public void delete(Long id)
    {
        repo.deleteById(id);
    }
}
