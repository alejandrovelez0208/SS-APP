package com.webapplication.ss_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.dtos.request.ProfileStatusRequest;
import com.webapplication.ss_app.dtos.response.AdminProfileDetailDto;
import com.webapplication.ss_app.dtos.response.AdminProfilePageDto;
import com.webapplication.ss_app.dtos.response.AdminProfileSummaryDto;
import com.webapplication.ss_app.service.interfaz.AdminProfileService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/profiles")
@RequiredArgsConstructor
public class AdminProfileController {

	private final AdminProfileService adminProfileService;

	@GetMapping
	public ResponseEntity<List<AdminProfileSummaryDto>> getAll(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) AccountType accountType,
			@RequestParam(required = false) ProfileStatus status,
			@RequestParam(required = false) VerificationStatus verificationStatus) {
		return ResponseEntity
				.ok(adminProfileService.getAllProfiles(search, accountType, status, verificationStatus));
	}

	@GetMapping("/page")
	public ResponseEntity<AdminProfilePageDto> getPage(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) AccountType accountType,
			@RequestParam(required = false) ProfileStatus status,
			@RequestParam(required = false) VerificationStatus verificationStatus,
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		return ResponseEntity.ok(adminProfileService.getProfilesPage(search, accountType, status,
				verificationStatus, page, size));
	}

	@GetMapping("/{id:\\d+}")
	public ResponseEntity<AdminProfileDetailDto> getById(@PathVariable Long id) {
		return ResponseEntity.ok(adminProfileService.getById(id));
	}

	@PatchMapping("/{id:\\d+}/status")
	public ResponseEntity<AdminProfileSummaryDto> updateStatus(@PathVariable Long id,
			@Valid @RequestBody ProfileStatusRequest request) {
		return ResponseEntity.ok(adminProfileService.updateStatus(id, request.getStatus()));
	}
}
