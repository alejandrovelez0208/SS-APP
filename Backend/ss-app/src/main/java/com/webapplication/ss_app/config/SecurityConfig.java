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
import com.webapplication.ss_app.security.JsonSecurityHandlers;

import lombok.RequiredArgsConstructor;

/**
 * Reglas de acceso a la API.
 *
 * <p>
 * Criterio general:
 * <ul>
 * <li>Autenticación (login, registro, recuperación): pública, sin sesión.</li>
 * <li>Consultas genéricas de lectura (catálogos, imágenes): públicas.</li>
 * <li>Búsqueda de catálogos del signup: pública (el usuario aún no tiene
 * sesión).</li>
 * <li>Escritura de catálogos e imágenes y listado de usuarios: solo ADMIN.</li>
 * <li>Resto: cualquier usuario autenticado.</li>
 * </ul>
 *
 * <p>
 * El orden de las reglas importa: las más específicas van antes.
 */
@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	private final JsonSecurityHandlers jsonSecurityHandlers;

	// ---- Públicos: autenticación sin sesión ----
	private static final String[] PUBLIC_AUTH_ENDPOINTS = { "/api/auth/login", "/api/auth/signup",
			"/api/auth/validate-email*", "/api/auth/verify-email", "/api/auth/resend-verification",
			"/api/auth/forgot-password", "/api/auth/reset-password", "/api/auth/refresh", "/api/auth/logout" };

	// ---- Públicos: consultas genéricas de lectura ----
	private static final String[] PUBLIC_READ_ENDPOINTS = { "/api/catalogs", "/api/catalogs/**", "/api/images/**" };

	// ---- Solo ADMIN: escritura en datos compartidos ----
	private static final String[] ADMIN_WRITE_ENDPOINTS = { "/api/catalogs", "/api/catalogs/**",
			"/api/images/upload", "/api/users/**" };

	// ---- Solo ADMIN: lecturas sensibles ----
	private static final String[] ADMIN_READ_ENDPOINTS = { "/api/users", "/api/users/**" };

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http.csrf(csrf -> csrf.disable()).cors(cors -> {
		}).authorizeHttpRequests(auth -> auth.requestMatchers(PUBLIC_AUTH_ENDPOINTS).permitAll()
				.requestMatchers(HttpMethod.GET, PUBLIC_READ_ENDPOINTS).permitAll()
				.requestMatchers(HttpMethod.GET, ADMIN_READ_ENDPOINTS).hasRole("ADMIN")
				.requestMatchers(HttpMethod.POST, ADMIN_WRITE_ENDPOINTS).hasRole("ADMIN")
				.requestMatchers(HttpMethod.PATCH, ADMIN_WRITE_ENDPOINTS).hasRole("ADMIN").anyRequest()
				.authenticated())
				.exceptionHandling(ex -> ex
						.authenticationEntryPoint(jsonSecurityHandlers)
						.accessDeniedHandler(jsonSecurityHandlers))
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}
}
