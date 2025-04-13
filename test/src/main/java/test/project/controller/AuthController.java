package main.java.test.project.controller;

import main.java.test.project.model.log_in.AuthRequest;
import main.java.test.project.model.log_in.AuthResponse;
import main.java.test.project.model.log_in.Role;
import main.java.test.project.model.log_in.User;
import main.java.test.project.repository.UserRepository;
import main.java.test.project.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // SIGN UP
    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("User already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole())); // careful: frontend can send anything

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }

    // SIGN IN
    @PostMapping("/signin")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());


        return ResponseEntity.ok(new AuthResponse(token));
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        String role = jwtUtil.extractRole(token);

        if (!role.equals("ADMIN")) {
            return ResponseEntity.status(403).body("Access denied");
        }

        return ResponseEntity.ok(userRepository.findAll());
    }


}
