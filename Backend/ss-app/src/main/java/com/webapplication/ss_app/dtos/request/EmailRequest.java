package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmailRequest implements Serializable {

	private static final long serialVersionUID = -5543124710199924186L;
	
	@NotBlank(message = "Email is required")
	@Email(message = "Invalid email format")
	private String email;

}
