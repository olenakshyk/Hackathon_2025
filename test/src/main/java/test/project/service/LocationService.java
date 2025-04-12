package test.project.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import test.project.spec.LocationSpecification;
import test.project.model.Cluster;
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

    public List<LocationDTO> filterAndMaybeClusterLocations(
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
                .and(LocationSpecification.withinBounds(latMin, latMax, lonMin, lonMax));

    List<Location> results = locationRepository.findAll(spec);

    //double clusterDistance = getClusterDistanceFromBounds(latMin, lonMin, latMax, lonMax);

    //if (clusterDistance == 0) {
        return results.stream().map(loc -> toDTO(loc, false)).toList();
    //} else {
      //  return getClusteredLocationsByDistance(results, clusterDistance);
    //}
    }

    private double getClusterDistanceFromBounds(
        double latMin, double lonMin,
        double latMax, double lonMax
    ) {
        double diagonalKm = haversine(latMin, lonMin, latMax, lonMax) / 1000.0;

        if (diagonalKm < 10) return 0;
        else if (diagonalKm < 20) return 250;
        else return 500;
    }


    private List<LocationDTO> getClusteredLocationsByDistance(List<Location> locations, double distanceThreshold) {
        List<Cluster> clusters = new ArrayList<>();
    
        for (Location loc : locations) {
            if (loc.getLat() == null || loc.getLon() == null) continue;
    
            boolean added = false;
    
            for (Cluster cluster : clusters) {
                double distance = haversine(loc.getLat(), loc.getLon(), cluster.getCenterLat(), cluster.getCenterLon());
                if (distance <= distanceThreshold) {
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
    
        List<LocationDTO> dtos = new ArrayList<>();
        for (Cluster cluster : clusters) {
            Location representative = cluster.getLocations().get(0);
            LocationDTO dto = toDTO(representative, true);
            dto.setLat(cluster.getCenterLat());
            dto.setLon(cluster.getCenterLon());
            dtos.add(dto);
        }
    
        return dtos;
    }
    

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
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
        loc.getOnFirstFloor(),
        isCluster
    );
}

}
