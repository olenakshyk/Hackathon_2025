package test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import test.project.model.Location;
import test.project.service.LocationService;

import java.util.List;

@RestController
@RequestMapping("/locations")
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
        @RequestParam(required = false) Double lat,
        @RequestParam(required = false) Double lon,
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
            lat,
            lon,
            onFirstFloor,
            type,
            subtype,
            inclusivity
    );

    return ResponseEntity.ok(results);
}

}
