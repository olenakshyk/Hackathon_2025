package test.project.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.web.bind.annotation.RequestParam;

import test.project.model.Place;

public interface PlaceRepository extends JpaRepository<Place, Long> {
    Optional<Place> findByInclusivity(Integer inclusivity);
    Optional<Place> findByRating(Double rating);

    @Query(value = """
    SELECT p, 
           (6371 * acos(
               cos(radians(:lat)) *
               cos(radians(p.lat)) *
               cos(radians(p.lon) - radians(:lon)) +
               sin(radians(:lat)) *
               sin(radians(p.lat))
           )) AS distance
    FROM places_tbl p
    WHERE 
        (:type IS NULL OR p.type = :type) AND
        (:subtype IS NULL OR p.subtype = :subtype) AND
        (:rating IS NULL OR p.rating >= :rating) AND
        (:hasRamp IS NULL OR p.hasRamp = :hasRamp) AND
        (:hasTactilePaving IS NULL OR p.hasTactilePaving = :hasTactilePaving) AND
        (:hasAdaptiveToilet IS NULL OR p.hasAdaptiveToilet = :hasAdaptiveToilet) AND
        (:hasElevator IS NULL OR p.hasElevator = :hasElevator) AND
        (:onFirstFloor IS NULL OR p.onFirstFloor = :onFirstFloor) AND
        (:inclusivity IS NULL OR p.inclusivity = :inclusivity)
    HAVING distance < :radius
    ORDER BY distance
    """, nativeQuery = true)
    List<Place> findPlacesByMultipleCriteria(
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
        @RequestParam(value = "inclusivity", required = false) Integer inclusivity
    );
}
