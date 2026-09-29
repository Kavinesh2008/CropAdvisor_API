package com.example.cropadvisor.service;

import com.example.cropadvisor.model.TicketModel;
import java.util.*;

public interface TicketService {
    public TicketModel create(TicketModel data);
    public List<TicketModel> getData();
    public TicketModel update(Long id,TicketModel data);
    public void delete(Long id);
}
