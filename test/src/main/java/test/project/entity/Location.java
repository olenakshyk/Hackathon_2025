package test.project.entity;

import jakarta.persistence.*;

@Entity
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Boolean hasAdaptiveToilet;
    private Boolean hasElevator;
    private Boolean hasRamp;
    private Boolean hasTactilePaving;

    private Integer lat;
    private Integer lon;

    private Boolean onFirstFloor;

    private Double rating;
    private Integer id;


    private String name;
    private String subType;
    private String type;


}
