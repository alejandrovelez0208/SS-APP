package com.webapplication.ss_app.dtos;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Detalle de un usuario del directorio, incluyendo el resumen de sus perfiles.
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class UserDetailDto extends UserDto {

	private static final long serialVersionUID = 1L;

	private List<ProfileSummaryDto> profiles = new ArrayList<>();
}
