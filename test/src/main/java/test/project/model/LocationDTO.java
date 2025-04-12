package test.project.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LocationDTO {
    private final String objectType = "location";
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
    // private Boolean isClaster;

    @JsonProperty("objectType")
    public String getObjectType() {
        return "location";
    }

}
