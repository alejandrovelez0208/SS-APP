package com.webapplication.ss_app.exception;

public class BadCredentialsException extends RuntimeException {

	private static final long serialVersionUID = 6948566681120029526L;

	public BadCredentialsException(String message) {
		super(message);
	}

}