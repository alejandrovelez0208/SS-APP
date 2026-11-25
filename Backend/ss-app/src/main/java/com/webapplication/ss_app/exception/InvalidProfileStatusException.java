package com.webapplication.ss_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class InvalidProfileStatusException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public InvalidProfileStatusException(String message) {
		super(message);
	}
}
