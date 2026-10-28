package com.webapplication.ss_app.exception;

public class EmailAlreadyExistsException extends RuntimeException {

	private static final long serialVersionUID = 2450136218936343976L;

	public EmailAlreadyExistsException(String message) {
		super(message);
	}
}
