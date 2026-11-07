package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.CatalogType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CatalogResponse implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String name;
	private CatalogType catalogType;
	private Boolean active;

}
