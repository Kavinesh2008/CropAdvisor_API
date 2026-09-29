package com.example.cropadvisor.service;

import org.springframework.stereotype.Service;

import com.example.cropadvisor.model.RegionModel;
import com.example.cropadvisor.repository.RegionRepo;
import java.util.List;

@Service 
public class RegionServiceImpl implements RegionService{
    private final RegionRepo repo;
    public RegionServiceImpl(RegionRepo repo) {
        this.repo = repo;
    }
    @Override 
    public RegionModel create(RegionModel data)
    {
        return repo.save(data);
    }
    @Override 
    public List<RegionModel> getData()
    {
        return repo.findAll();
    }
    @Override 
    public RegionModel update(Long id,RegionModel data)
    {
        RegionModel exRegion = repo.findById(id).orElse(null);
        if(exRegion==null)
            return null;
        exRegion.setDistrict(data.getDistrict());
        exRegion.setState(data.getState());
        exRegion.setPin_code(data.getPin_code());
        exRegion.setRegion_name(data.getRegion_name());
        return repo.save(exRegion);
    }
    @Override 
    public void delete(Long id)
    {
        repo.deleteById(id);
    }
}
