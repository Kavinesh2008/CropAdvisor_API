package com.example.cropadvisor.service;

import com.example.cropadvisor.model.PhotoModel;
import java.util.List;

public interface PhotoService {
    public PhotoModel create(PhotoModel data);
    public List<PhotoModel> getData();
    public PhotoModel update(Long id,PhotoModel data);
    public void delete(Long id);
}
