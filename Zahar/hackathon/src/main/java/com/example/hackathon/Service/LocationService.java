package com.example.hackathon.Service;

import com.example.hackathon.Entity.Location;
import com.example.hackathon.Repo.LocationRepository;
import com.example.hackathon.Spec.LocationSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LocationService {

    private final LocationRepository locationRepository;

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Location> filterLocations(
            Boolean hasRamp,
            Boolean hasElevator,
            Boolean hasAdaptiveToilet,
            Boolean hasTactilePaving,
            Boolean onFirstFloor,
            String type,
            String subtype,
            Integer inclusivity
    ) {
        Specification<Location> spec = Specification.where(LocationSpecification.hasRamp(hasRamp))
                .and(LocationSpecification.hasElevator(hasElevator))
                .and(LocationSpecification.hasAdaptiveToilet(hasAdaptiveToilet))
                .and(LocationSpecification.hasTactilePaving(hasTactilePaving))
                .and(LocationSpecification.onFirstFloor(onFirstFloor))
                .and(LocationSpecification.typeEquals(type))
                .and(LocationSpecification.subtypeEquals(subtype))
                .and(LocationSpecification.inclusivityEquals(inclusivity));

        return locationRepository.findAll(spec);
    }
}
