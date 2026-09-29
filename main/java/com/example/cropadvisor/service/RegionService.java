package com.example.cropadvisor.service;

import com.example.cropadvisor.model.RegionModel;
import java.util.*;

public interface RegionService {
    public RegionModel create(RegionModel data);
    public List<RegionModel> getData();
    public RegionModel update(Long id,RegionModel data);
    public void delete(Long id);
}
