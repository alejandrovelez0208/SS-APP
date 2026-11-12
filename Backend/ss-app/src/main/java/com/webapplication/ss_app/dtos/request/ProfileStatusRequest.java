package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.ProfileStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProfileStatusRequest implements Serializable {

	private static final long serialVersionUID = -9017254310933070954L;

	@NotNull(message = "Status is required")
	private ProfileStatus status;

}
