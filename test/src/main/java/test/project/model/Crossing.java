package test.project.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "crossings_tbl")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Crossing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Float lat;
    private Float lon;
    private String type;
    private boolean hasTactilePaving;
    private boolean hasSoundSignals;
    private Integer inclusivity;
}
