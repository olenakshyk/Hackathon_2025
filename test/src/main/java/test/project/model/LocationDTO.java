package test.project.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDTO {
    private Long id;
    private String name;
    private Double lat;
    private Double lon;
    private String type;
    private String subtype;
    private String description;
    private Integer inclusivity;
    private Double rating;
    private Boolean hasAdaptiveToilet;
    private Boolean hasElevator;
    private Boolean hasRamp;
    private Boolean hasTactilePaving;
    private Boolean onFirstFloor;

}
