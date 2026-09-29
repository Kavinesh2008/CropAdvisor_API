package com.example.cropadvisor.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.cropadvisor.model.FarmerModel;
import com.example.cropadvisor.service.FarmerService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController 
//http://localhost:8080/farmer
@RequestMapping("/farmer")
public class FarmerController {
   private final FarmerService ser;
   public FarmerController(FarmerService ser) {
       this.ser = ser;
   }
   @PostMapping ("/create")
   //http://localhost:8080/farmer/create
   public FarmerModel create(@RequestBody FarmerModel data)
   {
       return ser.create(data);
   }
   @GetMapping ("/get")
   //http://localhost:8080/farmer/get
   public List<FarmerModel> getData()
   {
       return ser.getData();
   }
   @PutMapping ("/update/{id}")
   //http://localhost:8080/farmer/update/{id}
   public FarmerModel update(@PathVariable Long id,@RequestBody FarmerModel data)
   {
       return ser.update(id,data);
   }
   @DeleteMapping ("/delete/{id}")
   //http://localhost:8080/farmer/delete/{id}
   public String delete(@PathVariable Long id)
   {
       ser.delete(id);
       return "farmer deleted successfully";
   }
}
