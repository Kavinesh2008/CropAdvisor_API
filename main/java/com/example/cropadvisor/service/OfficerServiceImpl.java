package com.example.cropadvisor.service;

import org.springframework.stereotype.Service;

import com.example.cropadvisor.model.OfficerModel;
import com.example.cropadvisor.repository.OfficerRepo;
import java.util.List;

@Service 
public class OfficerServiceImpl implements OfficerService{
    private final OfficerRepo repo;
    public OfficerServiceImpl(OfficerRepo repo) {
        this.repo = repo;
    }
    @Override 
    public OfficerModel create(OfficerModel data)
    {
        return repo.save(data);
    }
    @Override 
    public List<OfficerModel> getData()
    {
        return repo.findAll();
    }
    @Override 
    public OfficerModel update(Long id,OfficerModel data)
    {
        OfficerModel exOfficer = repo.findById(id).orElse(null);
        if(exOfficer==null)
            return null;
        exOfficer.setOfficer_name(data.getOfficer_name());
        exOfficer.setPhone(data.getPhone());
        exOfficer.setEmail(data.getEmail());
        exOfficer.setSpecialization(data.getSpecialization());
        exOfficer.setRegion(data.getRegion());
        exOfficer.setActive(data.getActive());
        exOfficer.setCreated_at(data.getCreated_at());
        return repo.save(exOfficer);
    }
    @Override
    public void delete(Long id)
    {
        repo.deleteById(id);
    }
}
