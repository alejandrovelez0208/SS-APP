package com.webapplication.ss_app.security;

import java.io.IOException;
import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Respuestas JSON para errores de seguridad (401 / 403), con el mismo
 * formato que devuelve {@code GlobalExceptionHandler}
 * ({@code timestamp}, {@code status}, {@code error}).
 *
 * <p>Evita las respuestas vacías por defecto de Spring Security, que
 * dificultan diagnosticar si el problema es falta de token o de rol.
 */
@Component
public class JsonSecurityHandlers implements AuthenticationEntryPoint, AccessDeniedHandler {

	/** Sin token o con token inválido: no hay identidad. */
	@Override
	public void commence(HttpServletRequest request, HttpServletResponse response,
			AuthenticationException authException) throws IOException {
		writeJson(response, HttpStatus.UNAUTHORIZED,
				"No autenticado. Inicia sesión primero.");
	}

	/** Autenticado pero sin el rol necesario (p. ej. no es ADMIN). */
	@Override
	public void handle(HttpServletRequest request, HttpServletResponse response,
			AccessDeniedException accessDeniedException) throws IOException {
		writeJson(response, HttpStatus.FORBIDDEN,
				"No tienes permisos de administrador para esta acción.");
	}

	private void writeJson(HttpServletResponse response, HttpStatus status, String message) throws IOException {
		response.setStatus(status.value());
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.setCharacterEncoding("UTF-8");

		// Mensajes internos constantes, sin dependencias externas:
		// se escapan comillas y barras para producir JSON válido.
		String body = "{\"timestamp\":\"" + Instant.now() + "\",\"status\":" + status.value()
				+ ",\"error\":\"" + escapeJson(message) + "\"}";
		response.getWriter().write(body);
	}

	private static String escapeJson(String value) {
		return value.replace("\\", "\\\\").replace("\"", "\\\"");
	}
}
