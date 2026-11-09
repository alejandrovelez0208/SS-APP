package com.webapplication.ss_app.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Cambio de acceso (habilitar / deshabilitar) de un usuario.
 */
@Data
public class UserStatusRequest {

	@NotNull(message = "enabled is required")
	private Boolean enabled;
}
