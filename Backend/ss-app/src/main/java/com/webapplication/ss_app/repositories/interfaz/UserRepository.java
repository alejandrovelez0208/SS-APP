package com.webapplication.ss_app.repositories.interfaz;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webapplication.ss_app.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);
}
