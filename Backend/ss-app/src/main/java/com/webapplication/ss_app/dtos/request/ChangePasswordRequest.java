package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotBlank(message = "Current password is required")
	private String currentPassword;

	@NotBlank(message = "New password is required")
	private String newPassword;

}
