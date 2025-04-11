package test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import test.project.entity.Location;
import test.project.repo.LocationRepository;
import test.project.service.LocationService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/places_tbl")
@CrossOrigin
public class LocationController {

    private LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Location>> filter(
        @RequestParam(required = false) Long id,
        @RequestParam(required = false) Boolean hasRamp,
        @RequestParam(required = false) Boolean hasElevator,
        @RequestParam(required = false) Boolean hasAdaptiveToilet,
        @RequestParam(required = false) Boolean hasTactilePaving,
        @RequestParam(required = false) Boolean onFirstFloor,
        @RequestParam(required = false) String type,
        @RequestParam(required = false) String subtype,
        @RequestParam(required = false) Integer inclusivity
) {
    List<Location> results = locationService.filterLocations(
            id,
            hasRamp,
            hasElevator,
            hasAdaptiveToilet,
            hasTactilePaving,
            onFirstFloor,
            type,
            subtype,
            inclusivity
    );

    return ResponseEntity.ok(results);
}

}
