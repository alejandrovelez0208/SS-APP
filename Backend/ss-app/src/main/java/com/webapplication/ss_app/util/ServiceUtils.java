package com.webapplication.ss_app.util;

import org.springframework.stereotype.Component;

import com.webapplication.ss_app.entity.User;
import com.webapplication.ss_app.exception.ResourceNotFoundException;
import com.webapplication.ss_app.repositories.interfaz.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ServiceUtils {

	private final UserRepository userRepository;

	public User getUserByEmailOrThrow(String email) {
		return userRepository.findByEmail(email)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with email" + email));
	}

	public User getUserByIdOrThrow(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
	}
}
