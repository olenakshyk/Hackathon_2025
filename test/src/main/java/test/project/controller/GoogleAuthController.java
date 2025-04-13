package test.project.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import test.project.model.log_in.User;
import test.project.repository.UserRepository;
import test.project.security.JwtUtil;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class GoogleAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final Dotenv dotenv = Dotenv.load();
    private final String CLIENT_ID = dotenv.get("GOOGLE_CLIENT_ID");

    private final JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody String idTokenString) throws GeneralSecurityException, IOException {

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                jsonFactory)
                .setAudience(Collections.singletonList(CLIENT_ID))
                .build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken != null) {
            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();

            // check if user already exists
            User user = userRepository.findByUsername(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setPassword("");  // google users don't need password

                return userRepository.save(newUser);
            });

            String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());
            return ResponseEntity.ok(token);
        } else {
            return ResponseEntity.badRequest().body("Invalid Google Token");
        }
    }
}
