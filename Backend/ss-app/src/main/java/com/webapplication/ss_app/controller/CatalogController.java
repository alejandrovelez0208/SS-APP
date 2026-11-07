package com.webapplication.ss_app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.enums.CatalogType;
import com.webapplication.ss_app.dtos.request.CatalogCreateRequest;
import com.webapplication.ss_app.dtos.request.CatalogStatusRequest;
import com.webapplication.ss_app.dtos.response.CatalogResponse;
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

	@GetMapping
	public ResponseEntity<List<CatalogResponse>> getAll(@RequestParam(required = false) CatalogType type,
			@RequestParam(required = false) Boolean active) {
		return ResponseEntity.ok(catalogService.getAllCatalogs(type, active));
	}

	@PostMapping
	public ResponseEntity<CatalogResponse> create(@Valid @RequestBody CatalogCreateRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createCatalog(request));
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<CatalogResponse> updateStatus(@PathVariable Long id,
			@Valid @RequestBody CatalogStatusRequest request) {
		return ResponseEntity.ok(catalogService.updateStatus(id, request.getActive()));
	}
}
