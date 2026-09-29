package com.example.cropadvisor.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.cropadvisor.model.RegionModel;
import com.example.cropadvisor.service.RegionService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController 
//http://localhost:8080/Region
@RequestMapping("/Region")
public class RegionController {
    private final RegionService ser;
    public RegionController(RegionService ser) {
        this.ser = ser;
    }
    @PostMapping ("/create")
    //http://localhost:8080/Region/create
    public RegionModel create(@RequestBody RegionModel data)
    {
        return ser.create(data);
    }
    @GetMapping ("/get")
    //http://localhost:8080/Region/get
    public List<RegionModel> getData()
    {
        return ser.getData();
    }
    @PutMapping ("/update/{id}")
    //http://localhost:8080/Region/update/{id}
    public RegionModel update(@PathVariable Long id,@RequestBody RegionModel data)
    {
        return ser.update(id,data);
    }
    @DeleteMapping ("/delete/{id}")
    //http://localhost:8080/Region/delete/{id}
    public String delete(@PathVariable Long id)
    {
        ser.delete(id);
        return "Region deleted successfully";
    }
}
