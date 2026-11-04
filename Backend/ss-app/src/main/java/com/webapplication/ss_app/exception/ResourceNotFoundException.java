package com.webapplication.ss_app.exception;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 6958323467061796664L;

	public ResourceNotFoundException(String message) {
		super(message);
	}

}
