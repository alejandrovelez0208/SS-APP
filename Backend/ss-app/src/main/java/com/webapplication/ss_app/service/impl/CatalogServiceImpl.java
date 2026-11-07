package com.webapplication.ss_app.service.impl;

import org.springframework.stereotype.Service;

import com.webapplication.ss_app.dtos.request.CatalogRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;
import com.webapplication.ss_app.entity.Catalog;
import com.webapplication.ss_app.repositories.interfaz.CatalogRepository;
import com.webapplication.ss_app.service.interfaz.CatalogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

	private final CatalogRepository catalogRepository;

	@Override
	public MessageResponse createCatalog(CatalogRequest request) {
		Catalog catalog = new Catalog();
		catalog.setName(request.getName());
		catalog.setCatalogType(request.getCatalogType());

		catalogRepository.save(catalog);

		return new MessageResponse("New item created succesful!");
	}

}
