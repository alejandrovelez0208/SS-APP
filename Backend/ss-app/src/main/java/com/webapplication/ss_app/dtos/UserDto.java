package com.webapplication.ss_app.dtos;

import java.io.Serializable;
import java.time.Instant;

import com.webapplication.ss_app.dtos.enums.Role;

import lombok.Data;

@Data
public class UserDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String email;
	private boolean emailVerified;
	private boolean isEnabled;
	private Instant lastLoginAt;
	private Instant createdAt;
	private Role role;
}
