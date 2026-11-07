package com.webapplication.ss_app.service.impl;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.webapplication.ss_app.dtos.enums.CatalogType;
import com.webapplication.ss_app.dtos.request.CatalogCreateRequest;
import com.webapplication.ss_app.dtos.response.CatalogResponse;
import com.webapplication.ss_app.entity.Catalog;
import com.webapplication.ss_app.exception.CatalogAlreadyExistsException;
import com.webapplication.ss_app.exception.ResourceNotFoundException;
import com.webapplication.ss_app.repositories.interfaz.CatalogRepository;
import com.webapplication.ss_app.service.interfaz.CatalogService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CatalogServiceImpl implements CatalogService {

	private static final Sort DEFAULT_SORT = Sort.by("catalogType").and(Sort.by("name"));

	private final CatalogRepository catalogRepository;

	@Override
	@Transactional
	public CatalogResponse createCatalog(CatalogCreateRequest request) {
		String name = request.getName().trim();

		if (catalogRepository.existsByCatalogTypeAndNameIgnoreCase(request.getCatalogType(), name)) {
			throw new CatalogAlreadyExistsException(String.format(Locale.ROOT,
					"Catalog item '%s' already exists for type %s", name, request.getCatalogType()));
		}

		Catalog catalog = new Catalog();
		catalog.setName(name);
		catalog.setCatalogType(request.getCatalogType());
		catalog.setActive(true);

		return toResponse(catalogRepository.save(catalog));
	}

	@Override
	@Transactional
	public CatalogResponse updateStatus(Long id, Boolean active) {
		Catalog catalog = catalogRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Catalog item not found: " + id));
		catalog.setActive(active);
		return toResponse(catalogRepository.save(catalog));
	}

	@Override
	@Transactional(readOnly = true)
	public List<CatalogResponse> getAllCatalogs(CatalogType type, Boolean active) {
		Specification<Catalog> specification = (root, query, criteriaBuilder) -> criteriaBuilder.conjunction();

		if (type != null) {
			specification = specification.and((root, query, criteriaBuilder) -> criteriaBuilder
					.equal(root.get("catalogType"), type));
		}
		if (active != null) {
			specification = specification.and(
					(root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("active"), active));
		}

		return catalogRepository.findAll(specification, DEFAULT_SORT).stream().map(this::toResponse).toList();
	}

	private CatalogResponse toResponse(Catalog catalog) {
		return CatalogResponse.builder().id(catalog.getId()).name(catalog.getName())
				.catalogType(catalog.getCatalogType()).active(catalog.getActive()).build();
	}
}
