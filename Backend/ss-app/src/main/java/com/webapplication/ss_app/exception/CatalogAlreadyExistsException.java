package com.webapplication.ss_app.exception;

public class CatalogAlreadyExistsException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public CatalogAlreadyExistsException(String message) {
		super(message);
	}
}
