package com.webapplication.ss_app.repositories.interfaz;

import com.webapplication.ss_app.dtos.enums.CatalogType;
import com.webapplication.ss_app.entity.Catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface CatalogRepository extends JpaRepository<Catalog, Long>, JpaSpecificationExecutor<Catalog> {

	boolean existsByCatalogTypeAndNameIgnoreCase(CatalogType catalogType, String name);
}
