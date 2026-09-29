package com.example.cropadvisor.service;

import org.springframework.stereotype.Service;

import com.example.cropadvisor.model.PhotoModel;
import com.example.cropadvisor.repository.PhotoRepo;
import java.util.List;

@Service 

public class PhotoServiceImpl implements PhotoService{
    private final PhotoRepo repo;
    public PhotoServiceImpl(PhotoRepo repo){
        this.repo=repo;
    }
    @Override 
    public PhotoModel create(PhotoModel data)
    {
        return repo.save(data);
    }
    @Override 
    public List<PhotoModel> getData()
    {
        return repo.findAll();
    }
    @Override 
    public PhotoModel update(Long id,PhotoModel data)
    {
        PhotoModel exPhoto = repo.findById(id).orElse(null);
        if(exPhoto==null)
            return null;
        exPhoto.setTicket(data.getTicket());
        exPhoto.setPhoto_url(data.getPhoto_url());
        exPhoto.setUploaded_at(data.getUploaded_at());
        return repo.save(exPhoto);
    }
    @Override
    public void delete(Long id)
    {
        repo.deleteById(id);
    }
}
