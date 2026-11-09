package com.webapplication.ss_app.repositories.interfaz;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.webapplication.ss_app.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

	/**
	 * Trae los perfiles de una cuenta con sus fotos ya cargadas, evitando el
	 * LazyInitializationException y el N+1 al contar fotos.
	 */
	@Query("SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.photos WHERE p.account.idAccount = :accountId ORDER BY p.id ASC")
	List<Profile> findByAccountIdWithPhotos(@Param("accountId") Long accountId);

	boolean existsByServices_Id(Long catalogId);

	boolean existsByDepartures_Id(Long catalogId);

	boolean existsByChannels_Id(Long catalogId);

	boolean existsByModalities_Id(Long catalogId);
}
