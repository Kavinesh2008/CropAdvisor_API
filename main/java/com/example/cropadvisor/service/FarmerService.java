package com.example.cropadvisor.service;

import com.example.cropadvisor.model.FarmerModel;
import java.util.List;

public interface FarmerService {
    public FarmerModel create(FarmerModel data);
    public List<FarmerModel> getData();
    public FarmerModel update(Long id,FarmerModel data);
    public void delete(Long id);
}
