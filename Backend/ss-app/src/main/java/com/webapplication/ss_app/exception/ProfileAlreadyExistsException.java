package com.webapplication.ss_app.exception;

public class ProfileAlreadyExistsException extends RuntimeException {
	private static final long serialVersionUID = -7856197493014038755L;

	public ProfileAlreadyExistsException(String message) {
		super(message);
	}
}
