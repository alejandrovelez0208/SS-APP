package com.webapplication.ss_app.dtos;

import java.io.Serializable;
import java.time.Instant;

import com.webapplication.ss_app.dtos.enums.AccountStatus;
import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.Role;

import lombok.Data;

/**
 * Fila del directorio de usuarios para el panel de administración.
 *
 * <p>
 * Resume la información de {@code User} y su {@code Account} asociada en una
 * sola lectura. Los datos sensibles (contraseña, tokens) nunca se exponen.
 */
@Data
public class UserDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String email;
	private boolean emailVerified;
	private boolean enabled;
	private Instant lastLoginAt;
	private Instant createdAt;
	private Role role;

	// Resumen de la cuenta asociada
	private String userName;
	private AccountType accountType;
	private AccountStatus accountStatus;
}
