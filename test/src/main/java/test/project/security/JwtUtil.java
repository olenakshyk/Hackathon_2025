package main.java.test.project.security;

import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private final Dotenv dotenv = Dotenv.load();
    private final String secret = dotenv.get("JWT_SECRET");
    private final long expirationMs = 3600000;

    // Create token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)            // Save username inside token
                .claim("role", role)
                .setIssuedAt(new Date())         // When token was created
                .setExpiration(new Date(System.currentTimeMillis() + expirationMs)) // Expiration time
                .signWith(SignatureAlgorithm.HS512, secret)  // Algorithm + secret key
                .compact();                      // Create token string
    }

    // Read username from token
    public String extractUsername(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Validate if token is correct
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractRole(String token) {
        return Jwts.parser()
                .setSigningKey(secret)
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

}
