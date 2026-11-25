package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminProfileOverviewDto implements Serializable {

	private static final long serialVersionUID = 1L;

	private long total;
	private long active;
	private long paused;
	private long inactive;
	private long draft;
}
