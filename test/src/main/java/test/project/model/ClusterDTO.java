package test.project.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class ClusterDTO {
    private double lat;
    private double lon;
    private int count;
    private List<LocationDTO> locations;
}
