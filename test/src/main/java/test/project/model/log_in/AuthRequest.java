package test.project.model.log_in;

import lombok.Getter;
import lombok.Setter;

//holds frontend data
@Getter
@Setter
public class AuthRequest {
    private String username;
    private String password;
    private Role role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
