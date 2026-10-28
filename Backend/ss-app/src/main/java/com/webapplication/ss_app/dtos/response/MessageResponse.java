package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponse implements Serializable {

	private static final long serialVersionUID = -4674298511440210455L;

	private String message;
}
