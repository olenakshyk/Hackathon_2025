package test.project.service;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import test.project.spec.LocationSpecification;
import test.project.model.Location;
import test.project.repository.LocationRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> filterLocations(
        Long id,
        Boolean hasRamp,
        Boolean hasElevator,
        Boolean hasAdaptiveToilet,
        Boolean hasTactilePaving,
        Double centerLat,
        Double centerLon,
        Boolean onFirstFloor,
        String type,
        String subtype,
        Integer inclusivity
    ) {
        Specification<Location> spec = Specification.where(LocationSpecification.idEquals(id))
                .and(LocationSpecification.hasRamp(hasRamp))
                .and(LocationSpecification.hasElevator(hasElevator))
                .and(LocationSpecification.hasAdaptiveToilet(hasAdaptiveToilet))
                .and(LocationSpecification.hasTactilePaving(hasTactilePaving))
                .and(LocationSpecification.onFirstFloor(onFirstFloor))
                .and(LocationSpecification.typeEquals(type))
                .and(LocationSpecification.subtypeEquals(subtype))
                .and(LocationSpecification.inclusivityEquals(inclusivity));

        List<Location> filtered = locationRepository.findAll(spec);

        if (centerLat != null && centerLon != null) {
            filtered = filtered.stream()
                .filter(loc -> {
                    if (loc.getLat() == null || loc.getLon() == null) return false;
                    double distance = haversine(centerLat, centerLon, loc.getLat(), loc.getLon());
                    return distance <= 10.0;
                })
                .collect(Collectors.toList());
        }

        return filtered;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
