package test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import test.project.model.NewReviewDTO;
import test.project.model.ReviewDTO;
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
        @RequestParam(required = false) List<String> features,
        @RequestParam(required = false) List<String> subtype,
        @RequestParam(required = false) Double rating,
        @RequestParam(required = false) Integer inclusivity,
        @RequestParam(required = false) String type
    )
 {
    if (latMin == null || latMax == null || lonMin == null || lonMax == null) {
        return ResponseEntity.badRequest().body(List.of());
    }

    List<Object> response = locationService.filterAndMaybeClusterLocations(
    id, hasRamp, hasElevator, hasAdaptiveToilet, hasTactilePaving, onFirstFloor,
    type, subtype, inclusivity, rating, latMin, latMax, lonMin, lonMax, features
    );

    return ResponseEntity.ok(response);
    }


    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<ReviewDTO>> getReviewsByLocationId(@PathVariable Long id) {
        List<ReviewDTO> reviews = locationService.getReviewsByPlaceId(id);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{id}/addComment")
    public ResponseEntity<String> addComment(
            @PathVariable Long id,
            @RequestBody NewReviewDTO newReview
    ) {

        if (newReview.getAuthor() == null || newReview.getRating() == null || newReview.getComment() == null) {
            return ResponseEntity.badRequest().body("Усі поля обов'язкові");
        }

        if (!id.equals(newReview.getPlaceId())) {
            return ResponseEntity.badRequest().body("ID в URL не збігається з ID в тілі запиту");
        }

        if (!locationService.userExists(newReview.getAuthor())) {
            return ResponseEntity.badRequest().body("Користувача з таким ім'ям не існує");
        }

        locationService.addReview(newReview);
        return ResponseEntity.ok("Коментар додано успішно");
    }


}
