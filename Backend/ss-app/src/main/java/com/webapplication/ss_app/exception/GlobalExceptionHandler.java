package com.webapplication.ss_app.exception;

import java.time.Instant;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

	private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

	private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
		Map<String, Object> body = Map.of("timestamp", Instant.now(), "error", message);
		return ResponseEntity.status(status).body(body);
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ResponseEntity<Map<String, Object>> handleAlreadyExistsException(EmailAlreadyExistsException ex) {
		log.warn("EmailAlreadyExistsException: {}", ex.getMessage());
		return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
	}

	@ExceptionHandler(EmailNotVerifiedException.class)
	public ResponseEntity<Map<String, Object>> handleEmailNotVerified(EmailNotVerifiedException ex) {
		log.warn("EmailNotVerifiedException: {}", ex.getMessage());
		return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
		log.warn("ResourceNotFoundException: {}", ex.getMessage());
		return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, Object>> handleResourceNotFoundException(BadCredentialsException ex) {
		log.warn("BadCredentialException: {}", ex.getMessage());
		return buildResponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
	}

	@ExceptionHandler(AccountDeactivatedException.class)
	public ResponseEntity<Map<String, Object>> handleAccountDeactived(AccountDeactivatedException ex) {
		log.warn("AccountDeactivatedException: {}", ex.getMessage());
		return buildResponse(HttpStatus.FORBIDDEN, ex.getMessage());
	}

	@ExceptionHandler(InvalidTokenException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidToken(InvalidTokenException ex) {
		log.warn("InvalidTokenException: {}", ex.getMessage());
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(InvalidCredentialsException.class)
	public ResponseEntity<Map<String, Object>> handleInvalidCredentialsException(InvalidCredentialsException ex) {
		log.warn("InvalidCredentialsException: {}", ex.getMessage());
		return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

}
