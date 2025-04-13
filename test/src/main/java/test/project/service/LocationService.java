package test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import test.project.spec.LocationSpecification;
import test.project.model.Cluster;
import test.project.model.ClusterDTO;
import test.project.model.Location;
import test.project.model.LocationDTO;
import test.project.model.NewReviewDTO;
import test.project.model.Review;
import test.project.model.ReviewDTO;
import test.project.repository.LocationRepository;
import test.project.repository.ReviewRepository;
import test.project.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class LocationService {

    @Autowired
    private UserRepository userRepository; // або UserService, якщо логіку винесено в сервіс


    private final LocationRepository locationRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<ReviewDTO> getReviewsByPlaceId(Long placeId) {
        List<Review> reviews = reviewRepository.findByPlaceId(placeId);
        return reviews.stream().map(review -> {
            ReviewDTO dto = new ReviewDTO();
            dto.setComment(review.getComment());
            dto.setRating(review.getRating());
            dto.setAuthor(review.getAuthor());
            return dto;
        }).collect(Collectors.toList());
    }

    public LocationService(LocationRepository locationRepository) {
        this.locationRepository = locationRepository;
    }

    public List<Object> filterAndMaybeClusterLocations(
    Long id,
    Boolean hasRamp,
    Boolean hasElevator,
    Boolean hasAdaptiveToilet,
    Boolean hasTactilePaving,
    Boolean onFirstFloor,
    String type,
    String subtype,
    Integer inclusivity,
    Double rating,
    Double latMin,
    Double latMax,
    Double lonMin,
    Double lonMax
)
 {
    Specification<Location> spec = Specification.where(LocationSpecification.idEquals(id))
            .and(LocationSpecification.hasRamp(hasRamp))
            .and(LocationSpecification.hasElevator(hasElevator))
            .and(LocationSpecification.hasAdaptiveToilet(hasAdaptiveToilet))
            .and(LocationSpecification.hasTactilePaving(hasTactilePaving))
            .and(LocationSpecification.onFirstFloor(onFirstFloor))
            .and(LocationSpecification.typeEquals(type))
            .and(LocationSpecification.subtypeEquals(subtype))
            .and(LocationSpecification.inclusivityEquals(inclusivity))
            .and(LocationSpecification.ratingAtLeast(rating))
            .and(LocationSpecification.withinBounds(latMin, lonMin, latMax, lonMax));

    List<Location> results = locationRepository.findAll(spec);
    double clusterDistance = getClusterDistanceFromBounds(latMin, lonMin, latMax, lonMax);
    if (clusterDistance == 0) {
        return results.stream().map(loc -> toDTO(loc, false)).map(x -> (Object)x).toList();
    } else {
        return getClusteredResult(results, clusterDistance);
    }
}


    private double getClusterDistanceFromBounds(double latMin, double lonMin, double latMax, double lonMax) {
        double ukraineArea = (53.0 - 44.0) * (41.0 - 21.0);
        double currentArea = Math.abs(latMax - latMin) * Math.abs(lonMax - lonMin);
        double ratio = currentArea / ukraineArea;
    
        if (ratio < 0.00005) return 0;
        else if(ratio < 0.001) return 0.2;
        else if(ratio <0.005) return 0.5;
        else if(ratio < 0.05) return 3;
        else if (ratio < 0.2) return 6;
        else if (ratio < 0.5) return 8;
        else return 12;
    }

    private List<Object> getClusteredResult(List<Location> locations, double clusterDistance) {
        List<Cluster> clusters = new ArrayList<>();
    
        for (Location loc : locations) {
            if (loc.getLat() == null || loc.getLon() == null) continue;
    
            boolean added = false;
            for (Cluster cluster : clusters) {
                double dist = haversine(loc.getLat(), loc.getLon(), cluster.getCenterLat(), cluster.getCenterLon());
                if (dist <= clusterDistance) {
                    cluster.add(loc);
                    added = true;
                    break;
                }
            }
    
            if (!added) {
                Cluster newCluster = new Cluster(loc.getLat(), loc.getLon());
                newCluster.add(loc);
                clusters.add(newCluster);
            }
        }
    
        List<Object> result = new ArrayList<>();
        for (Cluster c : clusters) {
            if (c.getLocations().size() == 1) {
                result.add(toDTO(c.getLocations().get(0), false));
            } else {
                result.add(new ClusterDTO(c.getCenterLat(), c.getCenterLon(), c.getLocations().size()));
            }
        }
    
        return result;
    }
    

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
    
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
    

    private LocationDTO toDTO(Location loc, boolean isCluster) {
    return new LocationDTO(
        loc.getId(),
        loc.getName(),
        loc.getLat(),
        loc.getLon(),
        loc.getType(),
        loc.getSubtype(),
        loc.getDescription(),
        loc.getInclusivity(),
        loc.getRating(),
        loc.getHasAdaptiveToilet(),
        loc.getHasElevator(),
        loc.getHasRamp(),
        loc.getHasTactilePaving(),
        loc.getOnFirstFloor()
    );
}

    public void addReview(NewReviewDTO dto) {
        Review review = new Review();
        review.setAuthor(dto.getAuthor());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setPlaceId(dto.getPlaceId());

        reviewRepository.save(review);

        updateLocationRating(dto.getPlaceId());
    }

    private void updateLocationRating(Long placeId) {
        List<Review> reviews = reviewRepository.findByPlaceId(placeId);
        double avg = reviews.stream().mapToInt(Review::getRating).average().orElse(0);
        
        locationRepository.findById(placeId).ifPresent(location -> {
            location.setRating(avg);
            locationRepository.save(location);
        });
    }

    public boolean userExists(String username) {
        return userRepository.findByUsername(username).isPresent();
    }
    

}
