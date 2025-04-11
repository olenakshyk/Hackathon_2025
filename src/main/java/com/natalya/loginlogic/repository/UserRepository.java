package com.natalya.loginlogic.repository;

import com.natalya.loginlogic.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

//automatically works with DB
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
