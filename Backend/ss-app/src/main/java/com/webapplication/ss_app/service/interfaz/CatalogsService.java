package com.webapplication.ss_app.service.interfaz;

import java.util.List;

import com.webapplication.ss_app.dtos.request.CatalogsFilterRequest;
import com.webapplication.ss_app.dtos.response.CatalogsResponse;

public interface CatalogsService {

	List<CatalogsResponse> catalogsQuery(CatalogsFilterRequest request);
}
