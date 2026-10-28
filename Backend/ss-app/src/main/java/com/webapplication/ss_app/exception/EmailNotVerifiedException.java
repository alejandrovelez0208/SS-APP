package com.webapplication.ss_app.exception;

public class EmailNotVerifiedException extends RuntimeException {

	private static final long serialVersionUID = -7749585205274261347L;

	public EmailNotVerifiedException(String message) {
		super(message);
	}
}
