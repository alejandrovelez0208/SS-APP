package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.CatalogType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CatalogCreateRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotBlank(message = "Name is required")
	@Size(max = 150, message = "Name must not exceed 150 characters")
	private String name;

	@NotNull(message = "Catalog Type is required")
	private CatalogType catalogType;

}
