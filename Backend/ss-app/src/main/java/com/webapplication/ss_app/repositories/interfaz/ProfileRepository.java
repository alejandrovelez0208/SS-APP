package com.webapplication.ss_app.repositories.interfaz;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

	/**
	 * Trae los perfiles de una cuenta con sus fotos ya cargadas, evitando el
	 * LazyInitializationException y el N+1 al contar fotos.
	 */
	@Query("SELECT DISTINCT p FROM Profile p LEFT JOIN FETCH p.photos WHERE p.account.idAccount = :accountId ORDER BY p.id ASC")
	List<Profile> findByAccountIdWithPhotos(@Param("accountId") Long accountId);

	@Query("""
			SELECT DISTINCT p
			FROM Profile p
			JOIN FETCH p.account a
			LEFT JOIN FETCH a.owner u
			LEFT JOIN FETCH p.photos
			WHERE (
			        LOWER(p.profileName) LIKE :searchPattern
			        OR LOWER(a.userName) LIKE :searchPattern
			        OR LOWER(u.email) LIKE :searchPattern
			        OR LOWER(p.city) LIKE :searchPattern
			      )
			  AND (:accountType IS NULL OR a.type = :accountType)
			  AND (:status IS NULL OR p.status = :status)
			  AND (:verificationStatus IS NULL OR p.verificationStatus = :verificationStatus)
			ORDER BY p.updatedAt DESC
			""")
	List<Profile> findAllForAdmin(@Param("searchPattern") String searchPattern,
			@Param("accountType") AccountType accountType, @Param("status") ProfileStatus status,
			@Param("verificationStatus") VerificationStatus verificationStatus);

	/**
	 * Cuenta servicios y canales por perfil en una sola consulta.
	 * Se usa para calcular la completitud sin provocar N+1 ni inflar las
	 * colecciones con productos cartesianos.
	 */
	@Query("""
			SELECT p.id AS profileId,
			       COUNT(DISTINCT s.id) AS servicesCount,
			       COUNT(DISTINCT c.id) AS channelsCount
			FROM Profile p
			LEFT JOIN p.services s
			LEFT JOIN p.channels c
			WHERE p.id IN :profileIds
			GROUP BY p.id
			""")
	List<ProfileCollectionCounts> countServicesAndChannels(@Param("profileIds") Collection<Long> profileIds);

	interface ProfileCollectionCounts {

		Long getProfileId();

		long getServicesCount();

		long getChannelsCount();
	}

	boolean existsByServices_Id(Long catalogId);

	boolean existsByDepartures_Id(Long catalogId);

	boolean existsByChannels_Id(Long catalogId);

	boolean existsByModalities_Id(Long catalogId);

	Optional<Profile> findFirstByAccount_IdAccount(Long accountId);
}
