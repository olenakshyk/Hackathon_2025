package test.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Додавання відгуку
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Review createReview(@RequestParam String author, 
                               @RequestParam String comment, 
                               @RequestParam int rating, 
                               @RequestParam Long placeId) {
        return reviewService.addReview(author, comment, rating, placeId);
    }
}

