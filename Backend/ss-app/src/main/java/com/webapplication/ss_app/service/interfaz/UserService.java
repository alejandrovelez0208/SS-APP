package com.webapplication.ss_app.service.interfaz;

import java.util.List;

import com.webapplication.ss_app.dtos.UserDto;
import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;

public interface UserService {

	MessageResponse createUser(UserRequest request);
	
	List<UserDto> getAllUsers();
}
