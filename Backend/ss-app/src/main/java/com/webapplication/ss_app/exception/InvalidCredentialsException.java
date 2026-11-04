package com.webapplication.ss_app.exception;

public class InvalidCredentialsException extends RuntimeException {

	private static final long serialVersionUID = -6877367934887477836L;

	public InvalidCredentialsException(String message) {
		super(message);
	}

}
