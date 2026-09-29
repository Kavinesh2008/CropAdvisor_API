package com.example.cropadvisor.service;

import com.example.cropadvisor.model.OfficerModel;
import java.util.List;

public interface OfficerService {
    public OfficerModel create(OfficerModel data);
    public List<OfficerModel> getData();
    public OfficerModel update(Long id,OfficerModel data);
    public void delete(Long id);
}
