package com.webapplication.ss_app.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.request.CatalogRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.service.interfaz.CatalogService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/catalogs")
@RequiredArgsConstructor
public class CatalogController {

	private final CatalogService catalogService;

	@PostMapping("/create")
	public ResponseEntity<MessageResponse> createCatalog(@Valid @RequestBody CatalogRequest request) {
		return ResponseEntity.ok(catalogService.createCatalog(request));
	}
}
