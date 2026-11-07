package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.CatalogType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CatalogRequest implements Serializable {

	private static final long serialVersionUID = 1L;

	@NotBlank(message = "Name is required")
	private String name;

	@NotNull(message = "Catalog Type is required")
	private CatalogType catalogType;

}
