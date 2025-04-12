package test.project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty;

@Data
@AllArgsConstructor
public class ClusterDTO {
    private final String objectType = "cluster";
    
    private double lat;
    private double lon;
    private int count;

    @JsonProperty("objectType")
    public String getObjectType() {
        return "cluster";
    }
}
