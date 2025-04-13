package test.project.model;

import lombok.Data;

@Data
public class NewReviewDTO {
    private Long placeId;
    private String author;
    private Integer rating;
    private String comment;
}
