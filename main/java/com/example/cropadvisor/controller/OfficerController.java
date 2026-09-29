package com.example.cropadvisor.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.cropadvisor.model.OfficerModel;
import com.example.cropadvisor.service.OfficerService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.*;

@RestController 
//http://localhost:8080/officer
@RequestMapping("/officer")
public class OfficerController {
    private final OfficerService ser;
    public OfficerController(OfficerService ser) {
        this.ser = ser;
    }
    @PostMapping ("/create")
    //http://localhost:8080/officer/create
    public OfficerModel create(@RequestBody OfficerModel data)
    {
        return ser.create(data);
    }
    @GetMapping ("/get")
    //http://localhost:8080/officer/get
    public List<OfficerModel> getData()
    {
        return ser.getData();
    }
    @PutMapping ("/update/{id}")
    //http://localhost:8080/officer/update/{id}
    public OfficerModel update(@PathVariable Long id,@RequestBody OfficerModel data)
    {
        return ser.update(id,data);
    }
    @DeleteMapping ("/delete/{id}")
    //http://localhost:8080/officer/delete/{id}
    public String delete(@PathVariable Long id)
    {
        ser.delete(id);
        return "officer deleted successfully";
    }
}
