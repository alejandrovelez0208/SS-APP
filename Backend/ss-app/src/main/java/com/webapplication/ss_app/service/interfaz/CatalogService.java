package com.webapplication.ss_app.service.interfaz;

import com.webapplication.ss_app.dtos.request.CatalogRequest;
import com.webapplication.ss_app.dtos.response.MessageResponse;

public interface CatalogService {

	MessageResponse createCatalog(CatalogRequest request);
}
