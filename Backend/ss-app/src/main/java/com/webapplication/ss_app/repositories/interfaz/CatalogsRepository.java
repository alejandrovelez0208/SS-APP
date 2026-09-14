package com.webapplication.ss_app.repositories.interfaz;

import java.util.List;

import com.webapplication.ss_app.dtos.request.CatalogsFilterRequest;
import com.webapplication.ss_app.dtos.response.CatalogsResponse;

public interface CatalogsRepository {

	List<CatalogsResponse> catalogsQuery(CatalogsFilterRequest request);
}
