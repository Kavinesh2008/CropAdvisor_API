package com.example.cropadvisor.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cropadvisor.model.PhotoModel;
import com.example.cropadvisor.service.PhotoService;
import java.util.List;

@RestController 
//http://localhost:8080/photo
@RequestMapping ("/photo")
public class PhotoController {
    private PhotoService ser;
    public PhotoController(PhotoService ser) {
        this.ser = ser;
    }
    @PostMapping ("/create")
    //http://localhost:8080/photo/create
    public PhotoModel create(@RequestBody  PhotoModel data)
    {
        return ser.create(data);
    }
    @GetMapping ("/get")
    //http://localhost:8080/photo/get
    public List<PhotoModel> getData()
    {
        return ser.getData();
    }
    @PutMapping ("/update/{id}")
    //http://localhost:8080/photo/update/{id}
    public PhotoModel update(@PathVariable  Long id,@RequestBody PhotoModel data)
    {
        return ser.update(id,data);
    }
    @DeleteMapping ("/delete/{id}")
    //http://localhost:8080/photo/delete/{id}"
    public String delete(@PathVariable  Long id)
    {
        ser.delete(id);
        return "photo deleted successfully";
    }
}
