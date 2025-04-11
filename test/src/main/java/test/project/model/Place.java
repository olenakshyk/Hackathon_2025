package test.project.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "places_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Place {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
private String name;

    @Column(length = 1000) 
    private String description;
    private Float lat;
    private Float lon;
    private String type;
    private String subtype;

    private Double rating;

    private boolean hasRamp;
    private boolean hasTactilePaving;
    private boolean hasAdaptiveToilet;
    private boolean hasElevator;
    private boolean onFirstFloor;
    private Integer inclusivity;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<Image> images;

    @OneToMany(mappedBy = "place", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference 
    private List<Review> reviews;

//     public Place(String name, String description, String type, String subtype, 
//              Double rating, boolean hasRamp, boolean hasTactilePaving, 
//              boolean hasAdaptiveToilet, boolean hasElevator, 
//              boolean onFirstttFloor, Integer inclusivity) {
//     this.name = name;
//     this.description = description;
//     this.type = type;
//     this.subtype = subtype;
//     this.rating = rating;
//     this.hasRamp = hasRamp;
//     this.hasTactilePaving = hasTactilePaving;
//     this.hasAdaptiveToilet = hasAdaptiveToilet;
//     this.hasElevator = hasElevator;
//     this.onFirstttFloor = onFirstttFloor;
//     this.inclusivity = inclusivity;
//     images = null;
//     reviews = null;
// }


}
