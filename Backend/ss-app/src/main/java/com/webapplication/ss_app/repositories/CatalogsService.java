package com.webapplication.ss_app.repositories;

import java.util.List;

import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import com.webapplication.ss_app.dtos.request.CatalogsFilterRequest;
import com.webapplication.ss_app.dtos.response.CatalogsResponse;
import com.webapplication.ss_app.repositories.interfaz.CatalogsRepository;

import lombok.RequiredArgsConstructor;

@Repository
@RequiredArgsConstructor
public class CatalogsService implements CatalogsRepository {

	private final NamedParameterJdbcTemplate jdbcTemplate;

	public List<CatalogsResponse> catalogsQuery(CatalogsFilterRequest request) {
		StringBuilder sql = new StringBuilder("""
				    SELECT id, type, code, description, fathertype
				    FROM public.catalogs
				    WHERE 1 = 1
				""");
		MapSqlParameterSource params = new MapSqlParameterSource();

		if (request.getType() != null) {
			sql.append(" AND type = :type");
			params.addValue("type", request.getType());
		}
		if (request.getFathertype() != null) {
			sql.append(" AND fathertype = :fathertype");
			params.addValue("fathertype", request.getFathertype());
		}

		return jdbcTemplate.query(sql.toString(), params, (rs, rowNum) -> new CatalogsResponse(rs.getLong("id"),
				rs.getLong("type"), rs.getLong("code"), rs.getString("description"), rs.getLong("fathertype")));
	}

}
