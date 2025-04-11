package com.example.hackathon.Entity;

public class LocationDTO {

    private String name;
    private String address;
    private String description;
    private Double rating;

    public LocationDTO(String name, String address, String description, Double rating) {
        this.name = name;
        this.address = address;
        this.description = description;
        this.rating = rating;
    }

}
