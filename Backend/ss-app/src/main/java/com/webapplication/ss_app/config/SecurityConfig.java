package com.webapplication.ss_app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.webapplication.ss_app.security.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Reglas de acceso a la API.
 *
 * Criterio general: - Autenticación (login, registro, recuperación): publica,
 * sin sesión. - Consultas genéricas de lectura (catálogos, imágenes): publicas.
 * - Escritura en datos compartidos (crear catálogos, subir imágenes): solo
 * ADMIN. - Resto (p. ej. cambiar contraseña, ver mi usuario): cualquier usuario
 * autenticado.
 *
 * El orden de las reglas importa: las más específicas van antes.
 */
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	// ---- Públicos: autenticación sin sesión ----
	private static final String[] PUBLIC_AUTH_ENDPOINTS = { "/api/auth/login", "/api/auth/signup",
			"/api/auth/validate-email*", "/api/auth/verify-email", "/api/auth/resend-verification",
			"/api/auth/forgot-password", "/api/auth/reset-password" };

	// ---- Públicos: consultas genéricas de lectura ----
	private static final String[] PUBLIC_READ_ENDPOINTS = { "/api/catalogs/**", "/api/images/**" };

	// ---- Solo ADMIN: escritura en datos compartidos ----
	private static final String[] ADMIN_ENDPOINTS = { "/api/catalogs/create", "/api/images/upload" };

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> {
		}).authorizeHttpRequests(auth -> auth.requestMatchers(PUBLIC_AUTH_ENDPOINTS).permitAll()
				.requestMatchers(HttpMethod.GET, PUBLIC_READ_ENDPOINTS).permitAll().requestMatchers(ADMIN_ENDPOINTS)
				.hasRole("ADMIN").anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
