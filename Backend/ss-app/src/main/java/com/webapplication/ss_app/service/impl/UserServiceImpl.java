package com.webapplication.ss_app.service.impl;

import org.springframework.stereotype.Service;

import com.webapplication.ss_app.dtos.request.UserRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.exception.EmailAlreadyExistsException;
import com.webapplication.ss_app.repositories.interfaz.UserRepository;
import com.webapplication.ss_app.service.interfaz.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;

	@Override
	public MessageResponse createUser(UserRequest request) {
		if (userRepository.findByEmail(request.getEmail()).isPresent()) {
			throw new EmailAlreadyExistsException("Email already exits");
		}
		return null;
	}

}
