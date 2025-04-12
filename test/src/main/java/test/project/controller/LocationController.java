package test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import test.project.service.LocationService;

import java.util.List;

@RestController
@RequestMapping("/locations")
@CrossOrigin
public class LocationController {

    private final LocationService locationService;

    @Autowired
    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Object>> filter(
    @RequestParam(required = false) Double latMin,
    @RequestParam(required = false) Double latMax,
    @RequestParam(required = false) Double lonMin,
    @RequestParam(required = false) Double lonMax,
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
    if (latMin == null || latMax == null || lonMin == null || lonMax == null) {
        return ResponseEntity.badRequest().body(List.of());
    }

    List<Object> response = locationService.filterAndMaybeClusterLocations(
        id, hasRamp, hasElevator, hasAdaptiveToilet, hasTactilePaving, onFirstFloor,
        type, subtype, inclusivity, latMin, latMax, lonMin, lonMax
    );

    return ResponseEntity.ok(response);
}

}
