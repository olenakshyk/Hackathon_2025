package test.project.repository;

import test.project.model.UserEntity;
import test.project.model.UserRoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IUserRoleRepository extends JpaRepository<UserRoleEntity, Long> {
    List<UserRoleEntity> findByUser(UserEntity User);
}
