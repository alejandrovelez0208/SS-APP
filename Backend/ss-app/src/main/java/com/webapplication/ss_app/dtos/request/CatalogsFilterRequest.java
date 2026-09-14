package com.webapplication.ss_app.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CatalogsFilterRequest {

	private Long type;
	private Long fathertype;

	public boolean hasFilters() {
		return type != null || fathertype != null;
	}
}
