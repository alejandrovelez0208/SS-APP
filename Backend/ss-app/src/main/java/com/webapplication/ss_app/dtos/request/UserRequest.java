package com.webapplication.ss_app.dtos.request;

import java.io.Serializable;

import lombok.Data;

@Data
public class UserRequest implements Serializable {

	private static final long serialVersionUID = 58174082483067019L;

	private String email;
	private String password;

}
