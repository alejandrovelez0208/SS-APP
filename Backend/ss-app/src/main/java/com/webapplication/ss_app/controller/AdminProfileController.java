package com.webapplication.ss_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.dtos.response.AdminProfileSummaryDto;
import com.webapplication.ss_app.service.interfaz.AdminProfileService;

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
}
