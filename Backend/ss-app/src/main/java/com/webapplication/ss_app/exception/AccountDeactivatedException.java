package com.webapplication.ss_app.exception;

public class AccountDeactivatedException extends RuntimeException {

	private static final long serialVersionUID = 4034662868894573079L;

	public AccountDeactivatedException(String message) {
		super(message);
	}

}