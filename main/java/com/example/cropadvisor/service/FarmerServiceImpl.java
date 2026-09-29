package com.example.cropadvisor.service;

import org.springframework.stereotype.Service;

import com.example.cropadvisor.model.FarmerModel;
import com.example.cropadvisor.repository.FarmerRepo;
import java.util.*;

@Service 
public class FarmerServiceImpl implements FarmerService{
    private final FarmerRepo repo;
    public FarmerServiceImpl(FarmerRepo repo) {
        this.repo = repo;
    }
    @Override 
    public FarmerModel create(FarmerModel data)
    {
        return repo.save(data);
    }
    @Override 
    public List<FarmerModel> getData()
    {
        return repo.findAll();
    }
    @Override 
    public FarmerModel update(Long id,FarmerModel data)
    {
        FarmerModel exFarmer = repo.findById(id).orElse(null);
        if(exFarmer==null)
            return null;
        exFarmer.setFarmer_name(data.getFarmer_name());
        exFarmer.setPhone(data.getPhone());
        exFarmer.setEmail(data.getEmail());
        exFarmer.setAddress(data.getAddress());
        exFarmer.setRegion(data.getRegion());
        exFarmer.setCreated_at(data.getCreated_at());
        return repo.save(exFarmer);
    }
    @Override 
    public void delete(Long id)
    {
        repo.deleteById(id);
    }
}
