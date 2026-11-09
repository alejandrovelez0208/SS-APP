package com.webapplication.ss_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.request.ProfileUpdateRequest;
import com.webapplication.ss_app.dtos.response.ProfileResponse;
import com.webapplication.ss_app.service.interfaz.ProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
public class ProfileController {

	private final ProfileService profileService;

	@GetMapping("/me")
	public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
		return ResponseEntity.ok(profileService.getMyProfile(authentication.getName()));
	}

	@PatchMapping("/me")
	public ResponseEntity<ProfileResponse> updateMyProfile(Authentication authentication,
			@Valid @RequestBody ProfileUpdateRequest request) {
		return ResponseEntity.ok(profileService.updateMyProfile(authentication.getName(), request));
	}

	@PostMapping("/me/complete")
	public ResponseEntity<ProfileResponse> completeMyProfile(Authentication authentication) {
		return ResponseEntity.ok(profileService.completeMyProfile(authentication.getName()));
	}
}
