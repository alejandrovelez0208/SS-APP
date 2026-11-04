package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest implements Serializable {

	private static final long serialVersionUID = -4712794204180626706L;

	@NotBlank(message = "Token is required")
	private String token;

	@NotBlank
	@Size(min = 6, message = "New password must be at least 6 characters long")
	private String newPassword;
}
