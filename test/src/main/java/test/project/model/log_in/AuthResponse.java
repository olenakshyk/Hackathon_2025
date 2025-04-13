package test.project.model.log_in;

public class AuthResponse {
    private String token;

    // Constructor
    public AuthResponse(String token) {
        this.token = token;
    }

    // Getter
    public String getToken() {
        return token;
    }
}
