package test.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import test.project.model.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}
