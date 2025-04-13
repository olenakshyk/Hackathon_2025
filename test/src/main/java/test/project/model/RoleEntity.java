package test.project.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roles_tbl")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 255)
    private String name;
}