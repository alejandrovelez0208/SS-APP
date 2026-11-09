package com.webapplication.ss_app.repositories.interfaz;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webapplication.ss_app.entity.RefreshToken;
import com.webapplication.ss_app.entity.User;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

	List<RefreshToken> findByUserAndRevokedFalse(User user);
}
