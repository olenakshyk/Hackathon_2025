package com.example.hackathon.Controller;

import com.example.hackathon.Entity.Location;
import com.example.hackathon.Service.LocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@CrossOrigin // дозволяє CORS-запити з фронтенду
public class LocationController {

    private final LocationService locationService;

    public LocationController(LocationService locationService) {
        this.locationService = locationService;
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Location>> filter(
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
