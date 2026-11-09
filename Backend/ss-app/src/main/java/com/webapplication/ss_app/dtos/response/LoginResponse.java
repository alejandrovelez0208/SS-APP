package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.AccountType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse implements Serializable {

	private static final long serialVersionUID = 4782294342987256049L;

	private String token;
	private String email;
	private String fullName;
	private String role;

	private Long profileId;
	private boolean profileComplete;
	private boolean emailVerified;
	private AccountType accountType;
	private String refreshToken;
}
