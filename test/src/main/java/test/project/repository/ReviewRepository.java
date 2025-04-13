package test.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import test.project.model.Review;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByPlaceId(Long placeId);
}
