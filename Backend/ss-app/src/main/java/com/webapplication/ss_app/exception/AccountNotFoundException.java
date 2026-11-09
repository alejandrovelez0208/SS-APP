package com.webapplication.ss_app.exception;

public class AccountNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 7133772051234686654L;

	public AccountNotFoundException(String message) {
		super(message);
	}
}
