package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CatalogStatusRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotNull(message = "Active is required")
	private Boolean active;

}
