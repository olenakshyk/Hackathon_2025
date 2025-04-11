package test.project.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import test.project.model.Place;
import test.project.repository.PlaceRepository;

@RestController
@RequestMapping("/api/places")
public class PlaceController {

    private final PlaceRepository placeRepository;

    @Autowired
    public PlaceController(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @GetMapping
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> getById(@PathVariable("id") Long Id) {
        Optional<Place> place = placeRepository.findById(Id);
        return place.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
    }
    

    @GetMapping("/by-inclusivity/{value}")
    public ResponseEntity<Place> getByInclusivity(@PathVariable Integer value) {
        Optional<Place> place = placeRepository.findByInclusivity(value);
        return place.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/by-rating/{value}")
    public ResponseEntity<Place> getByRating(@PathVariable Double value) {
        Optional<Place> place = placeRepository.findByRating(value);
        return place.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/filter")
    public List<Place> findPlacesByMultipleCriteria(
        @RequestParam(value = "lat", required = false) Double lat,
        @RequestParam(value = "lon", required = false) Double lon,
        @RequestParam(value = "radius", required = false) Double radius,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "subtype", required = false) String subtype,
        @RequestParam(value = "rating", required = false) Double rating,
        @RequestParam(value = "hasRamp", required = false) Boolean hasRamp,
        @RequestParam(value = "hasTactilePaving", required = false) Boolean hasTactilePaving,
        @RequestParam(value = "hasAdaptiveToilet", required = false) Boolean hasAdaptiveToilet,
        @RequestParam(value = "hasElevator", required = false) Boolean hasElevator,
        @RequestParam(value = "onFirstFloor", required = false) Boolean onFirstFloor,
        @RequestParam(value = "inclusivity", required = false) Integer inclusivity) {

        return placeRepository.findPlacesByMultipleCriteria(lat, lon, radius, type, subtype, rating, hasRamp, hasTactilePaving, hasAdaptiveToilet, hasElevator, onFirstFloor, inclusivity);
    }

    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        return placeRepository.save(place);
    }
}
