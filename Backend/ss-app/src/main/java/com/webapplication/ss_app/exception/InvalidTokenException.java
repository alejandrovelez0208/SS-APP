package com.webapplication.ss_app.exception;

public class InvalidTokenException extends RuntimeException {

	private static final long serialVersionUID = -3045382196049651582L;

	public InvalidTokenException(String message) {
		super(message);
	}

}
