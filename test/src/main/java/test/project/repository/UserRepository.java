package main.java.test.project.repository;

import main.java.test.project.model.log_in.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//automatically works with DB
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
