package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EmailValidationResponse implements Serializable {

	private static final long serialVersionUID = -6976673013390761124L;

	private boolean exits;
	private boolean available;
}
