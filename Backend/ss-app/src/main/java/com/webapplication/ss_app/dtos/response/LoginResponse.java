package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse implements Serializable {

	private static final long serialVersionUID = 4782294342987256049L;

	private String token;
	private String email;
	private String fullName;
	private String role;
}
