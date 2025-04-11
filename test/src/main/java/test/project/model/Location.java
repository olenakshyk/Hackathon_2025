package test.project.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "places_tbl")
public class Location {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "has_adaptive_toilet")
    private Boolean hasAdaptiveToilet;

    @Column(name = "has_elevator")
    private Boolean hasElevator;

    @Column(name = "has_ramp")
    private Boolean hasRamp;

    @Column(name = "has_tactile_paving")
    private Boolean hasTactilePaving;

    private Double lat;
    private Double lon;

    @Column(name = "on_first_floor")
    private Boolean onFirstFloor;
    
    @Column(name = "description")
    private String description;

    private Double rating;
    private String name;
    private String subtype;
    private String type;
}
