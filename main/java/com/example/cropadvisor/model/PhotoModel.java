package com.example.cropadvisor.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity 
@Table (name="ticketphoto")
public class PhotoModel {
    @Id 
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long photo_id;
    @ManyToOne 
    @JoinColumn (name="ticket")
    private TicketModel ticket;
    private String photo_url;
    private LocalDateTime uploaded_at;
    public Long getPhoto_id() {
        return photo_id;
    }
    public void setPhoto_id(Long photo_id) {
        this.photo_id = photo_id;
    }
    public TicketModel getTicket() {
        return ticket;
    }
    public void setTicket(TicketModel ticket) {
        this.ticket = ticket;
    }
    public String getPhoto_url() {
        return photo_url;
    }
    public void setPhoto_url(String photo_url) {
        this.photo_url = photo_url;
    }
    public LocalDateTime getUploaded_at() {
        return uploaded_at;
    }
    public void setUploaded_at(LocalDateTime uploaded_at) {
        this.uploaded_at = uploaded_at;
    }
    
}
