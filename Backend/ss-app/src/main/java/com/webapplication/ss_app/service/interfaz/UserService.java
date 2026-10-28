package com.webapplication.ss_app.service.interfaz;

import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;

public interface UserService {

	MessageResponse createUser(UserRequest request);
}
