package com.webapplication.ss_app.service.impl;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webapplication.ss_app.entity.RefreshToken;
import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.InvalidTokenException;
import com.webapplication.ss_app.repositories.interfaz.RefreshTokenRepository;

import lombok.RequiredArgsConstructor;

/**
 * Emite, rota y revoca refresh tokens. Solo se persiste el hash SHA-256.
 */
@Service
@RequiredArgsConstructor
public class RefreshTokenService {

	private static final int TOKEN_BYTES = 32;

	private final RefreshTokenRepository refreshTokenRepository;

	@Value("${jwt.refresh-expiration-days:7}")
	private long refreshExpirationDays;

	private final SecureRandom secureRandom = new SecureRandom();

	@Transactional
	public String createToken(User user) {
		String rawToken = generateRawToken();

		RefreshToken token = new RefreshToken();
		token.setUser(user);
		token.setTokenHash(hash(rawToken));
		token.setExpiresAt(Instant.now().plus(Duration.ofDays(refreshExpirationDays)));
		token.setRevoked(false);

		refreshTokenRepository.save(token);
		return rawToken;
	}

	@Transactional
	public RotatedToken rotate(String rawToken) {
		RefreshToken current = refreshTokenRepository.findByTokenHash(hash(rawToken))
				.orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

		if (current.isRevoked() || current.getExpiresAt().isBefore(Instant.now())) {
			throw new InvalidTokenException("Refresh token expired or revoked");
		}

		current.setRevoked(true);
		refreshTokenRepository.save(current);

		User user = current.getUser();
		String newToken = createToken(user);

		return new RotatedToken(user, newToken);
	}

	@Transactional
	public void revoke(String rawToken) {
		refreshTokenRepository.findByTokenHash(hash(rawToken)).ifPresent(token -> {
			token.setRevoked(true);
			refreshTokenRepository.save(token);
		});
	}

	@Transactional
	public void revokeAll(User user) {
		List<RefreshToken> tokens = refreshTokenRepository.findByUserAndRevokedFalse(user);
		tokens.forEach(token -> token.setRevoked(true));
		refreshTokenRepository.saveAll(tokens);
	}

	private String generateRawToken() {
		byte[] bytes = new byte[TOKEN_BYTES];
		secureRandom.nextBytes(bytes);
		return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
	}

	private String hash(String rawToken) {
		try {
			MessageDigest digest = MessageDigest.getInstance("SHA-256");
			byte[] hashed = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(hashed);
		} catch (NoSuchAlgorithmException exception) {
			throw new IllegalStateException("SHA-256 not available", exception);
		}
	}

	public record RotatedToken(User user, String refreshToken) {
	}
}
