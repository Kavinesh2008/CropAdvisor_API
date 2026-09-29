package com.example.cropadvisor.controller;

import org.springframework.web.bind.annotation.RestController;

import com.example.cropadvisor.model.TicketModel;
import com.example.cropadvisor.service.TicketService;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import java.util.List;

@RestController 
//http://localhost:8080/ticket
@RequestMapping("/ticket")
public class TicketController {
    private final TicketService ser;
    public TicketController(TicketService ser)
    {
        this.ser = ser;
    }
    @PostMapping ("/create")
    //http://localhost:8080/ticket/create
    public TicketModel create(@RequestBody TicketModel data)
    {
        return ser.create(data);
    }
    @GetMapping("/get")
    //http://localhost:8080/ticket/get
    public List<TicketModel> getData()
    {
        return ser.getData();
    }
    @PutMapping ("/update/{id}")
    //http://localhost:8080/ticket/update/{id}
    public TicketModel update(@PathVariable Long id,@RequestBody TicketModel data)
    {
        return ser.update(id,data);
    }
    @DeleteMapping ("/delete/{id}")
    //http://localhost:8080/ticket/delete/{id}
    public String delete(@PathVariable Long id)
    {
        ser.delete(id);
        return "ticket deleted successfully";
    }
}
