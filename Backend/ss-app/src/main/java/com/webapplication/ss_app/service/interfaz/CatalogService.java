package com.webapplication.ss_app.service.interfaz;

import java.util.List;

import com.webapplication.ss_app.dtos.enums.CatalogType;
import com.webapplication.ss_app.dtos.request.CatalogCreateRequest;
import com.webapplication.ss_app.dtos.response.CatalogResponse;

public interface CatalogService {

	CatalogResponse createCatalog(CatalogCreateRequest request);

	CatalogResponse updateStatus(Long id, Boolean active);

	List<CatalogResponse> getAllCatalogs(CatalogType type, Boolean active);
}
