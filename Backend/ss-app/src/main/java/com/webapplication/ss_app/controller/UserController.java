package com.webapplication.ss_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.UserDetailDto;
import com.webapplication.ss_app.dtos.UserDto;
import com.webapplication.ss_app.dtos.request.UserStatusRequest;
import com.webapplication.ss_app.service.interfaz.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@GetMapping("/get-all")
	public ResponseEntity<List<UserDto>> getAllUsers() {
		return ResponseEntity.ok(userService.getAllUsers());
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDetailDto> getUserDetail(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserDetail(id));
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<UserDto> updateStatus(@PathVariable Long id,
			@Valid @RequestBody UserStatusRequest request) {
		return ResponseEntity.ok(userService.updateStatus(id, request.getEnabled()));
	}
}
