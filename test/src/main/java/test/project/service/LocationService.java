package test.project.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import test.project.spec.LocationSpecification;
import test.project.model.Cluster;
import test.project.model.ClusterDTO;
import test.project.model.Location;
import test.project.model.LocationDTO;
import test.project.repository.LocationRepository;

import java.util.ArrayList;
import java.util.List;


@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Object> filterAndMaybeClusterLocations(
    Long id,
    Boolean hasRamp,
    Boolean hasElevator,
    Boolean hasAdaptiveToilet,
    Boolean hasTactilePaving,
    Boolean onFirstFloor,
    String type,
    String subtype,
    Integer inclusivity,
    Double latMin,
    Double latMax,
    Double lonMin,
    Double lonMax
) {
    Specification<Location> spec = Specification.where(LocationSpecification.idEquals(id))
            .and(LocationSpecification.hasRamp(hasRamp))
            .and(LocationSpecification.hasElevator(hasElevator))
            .and(LocationSpecification.hasAdaptiveToilet(hasAdaptiveToilet))
            .and(LocationSpecification.hasTactilePaving(hasTactilePaving))
            .and(LocationSpecification.onFirstFloor(onFirstFloor))
            .and(LocationSpecification.typeEquals(type))
            .and(LocationSpecification.subtypeEquals(subtype))
            .and(LocationSpecification.inclusivityEquals(inclusivity))
            .and(LocationSpecification.withinBounds(latMin, lonMin, latMax, lonMax));

    List<Location> results = locationRepository.findAll(spec);

    if (clusterDistance == 0) {
        return results.stream().map(loc -> toDTO(loc, false)).map(x -> (Object)x).toList();
    } else {
        return getClusteredResult(results, clusterDistance);
    }
}


    private double getClusterDistanceFromBounds(double latMin, double lonMin, double latMax, double lonMax) {
        double ukraineArea = (53.0 - 44.0) * (41.0 - 21.0);
        double currentArea = Math.abs(latMax - latMin) * Math.abs(lonMax - lonMin);
        double ratio = currentArea / ukraineArea;
    
        if (ratio < 0.01) return 0;
        else if (ratio < 0.1) return 100;
        else if (ratio < 0.4) return 250;
        else return 500;
    }

    private List<Object> getClusteredResult(List<Location> locations, double clusterDistance) {
    List<Cluster> clusters = new ArrayList<>();
    List<LocationDTO> singles = new ArrayList<>();

    for (Location loc : locations) {
        if (loc.getLat() == null || loc.getLon() == null) continue;

        boolean added = false;
        for (Cluster cluster : clusters) {
            double dist = haversine(loc.getLat(), loc.getLon(), cluster.getCenterLat(), cluster.getCenterLon());
            if (dist <= clusterDistance) {
                cluster.add(loc);
                added = true;
                break;
            }
        }

        if (!added) {
            Cluster newCluster = new Cluster(loc.getLat(), loc.getLon());
            newCluster.add(loc);
            clusters.add(newCluster);
        }
    }

    List<Object> result = new ArrayList<>();
    for (Cluster c : clusters) {
        if (c.getLocations().size() == 1) {
            result.add(toDTO(c.getLocations().get(0), false));
        } else {
            List<LocationDTO> clusterLocations = c.getLocations().stream()
                .map(loc -> toDTO(loc, false)).toList();
            result.add(new ClusterDTO(c.getCenterLat(), c.getCenterLon(), clusterLocations.size(), clusterLocations));
        }
    }

    return result;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
    
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    

    private LocationDTO toDTO(Location loc, boolean isCluster) {
    return new LocationDTO(
        loc.getId(),
        loc.getName(),
        loc.getLat(),
        loc.getLon(),
        loc.getType(),
        loc.getSubtype(),
        loc.getDescription(),
        loc.getInclusivity(),
        loc.getRating(),
        loc.getHasAdaptiveToilet(),
        loc.getHasElevator(),
        loc.getHasRamp(),
        loc.getHasTactilePaving(),
        loc.getOnFirstFloor()
        // isCluster = false
    );
}

}
