package test.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import test.project.model.Location;
import test.project.model.Review;
import test.project.repository.LocationRepository;
import test.project.repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Transactional
    public Review addReview(String author, String comment, int rating, Long placeId) {
        Location location = locationRepository.findById(placeId)
                .orElseThrow(() -> new RuntimeException("Location not found with id " + placeId));

        Review review = new Review();
        review.setAuthor(author);
        review.setComment(comment);
        review.setRating(rating);
        review.setPlace(location);

        return reviewRepository.save(review);
    }
}
