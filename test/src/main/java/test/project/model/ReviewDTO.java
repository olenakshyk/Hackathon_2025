package test.project.model;

import lombok.Data;

@Data
public class ReviewDTO {
    private String comment;
    private Integer rating;
    private String author;
}
