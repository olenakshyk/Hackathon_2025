package test.project.spec;

import org.springframework.data.jpa.domain.Specification;

import test.project.model.Location;

public class LocationSpecification {

    public static Specification<Location> hasRamp(Boolean value) {
        return (root, query, cb) -> value == null ? null : cb.equal(root.get("hasRamp"), value);
    }

    public static Specification<Location> hasElevator(Boolean value) {
        return (root, query, cb) -> value == null ? null : cb.equal(root.get("hasElevator"), value);
    }

    public static Specification<Location> hasAdaptiveToilet(Boolean value) {
        return (root, query, cb) -> value == null ? null : cb.equal(root.get("hasAdaptiveToilet"), value);
    }

    public static Specification<Location> hasTactilePaving(Boolean value) {
        return (root, query, cb) -> value == null ? null : cb.equal(root.get("hasTactilePaving"), value);
    }

    public static Specification<Location> onFirstFloor(Boolean value) {
        return (root, query, cb) -> value == null ? null : cb.equal(root.get("onFirstFloor"), value);
    }

    public static Specification<Location> typeEquals(String type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<Location> subtypeEquals(String subtype) {
        return (root, query, cb) -> subtype == null ? null : cb.equal(root.get("subtype"), subtype);
    }

    public static Specification<Location> inclusivityEquals(Integer inclusivity) {
        return (root, query, cb) -> inclusivity == null ? null : cb.greaterThanOrEqualTo(root.get("inclusivity"), inclusivity);
    }    

    public static Specification<Location> idEquals(Long id) {
        return (root, query, cb) -> id == null ? null : cb.equal(root.get("id"), id);
    }

    public static Specification<Location> ratingAtLeast(Double rating) {
        return (root, query, cb) -> rating == null ? null : cb.greaterThanOrEqualTo(root.get("rating"), rating);
    }

    public static Specification<Location> withinBounds(Double lat1, Double lon1, Double lat2, Double lon2) {
        return (root, query, criteriaBuilder) -> {
            if (lat1 == null || lat2 == null || lon1 == null || lon2 == null) {
                return criteriaBuilder.conjunction();
            }
    
            double latMin = Math.min(lat1, lat2);
            double latMax = Math.max(lat1, lat2);
            double lonMin = Math.min(lon1, lon2);
            double lonMax = Math.max(lon1, lon2);
    
            return criteriaBuilder.and(
                criteriaBuilder.between(root.get("lat"), latMin, latMax),
                criteriaBuilder.between(root.get("lon"), lonMin, lonMax)
            );
        };
    }    
}
