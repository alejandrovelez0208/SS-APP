package com.webapplication.ss_app.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.webapplication.ss_app.dtos.request.CatalogsFilterRequest;
import com.webapplication.ss_app.dtos.response.CatalogsResponse;
import com.webapplication.ss_app.repositories.interfaz.CatalogsRepository;
import com.webapplication.ss_app.service.interfaz.CatalogsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogsServiceImpl implements CatalogsService {

	private final CatalogsRepository repository;

	@Override
	public List<CatalogsResponse> catalogsQuery(CatalogsFilterRequest request) {
		return repository.catalogsQuery(request);
	}

}
