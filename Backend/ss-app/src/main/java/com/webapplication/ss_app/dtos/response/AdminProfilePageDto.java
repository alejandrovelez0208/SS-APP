package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfilePageDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private List<AdminProfileSummaryDto> content;
	private long totalElements;
	private int totalPages;
	private int page;
	private int size;
	private AdminProfileOverviewDto overview;
}
