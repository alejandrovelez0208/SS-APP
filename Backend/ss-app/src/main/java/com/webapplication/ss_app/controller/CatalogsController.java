package com.webapplication.ss_app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.webapplication.ss_app.dtos.request.CatalogsFilterRequest;
import com.webapplication.ss_app.dtos.response.CatalogsResponse;
import com.webapplication.ss_app.service.CatalogsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("api/catalogs")
@RequiredArgsConstructor
public class CatalogsController {

	private final CatalogsService catalogsService;

	@GetMapping
	public ResponseEntity<List<CatalogsResponse>> getCatalogs(@RequestBody CatalogsFilterRequest filter) {
		return ResponseEntity.ok(catalogsService.catalogsQuery(filter));
	}
}
