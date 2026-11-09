package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotBlank(message = "refreshToken is required")
	private String refreshToken;
}
