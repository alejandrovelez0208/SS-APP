package com.webapplication.ss_app.repositories.interfaz;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.webapplication.ss_app.dtos.enums.AccountType;
import com.webapplication.ss_app.dtos.enums.ProfileStatus;
import com.webapplication.ss_app.dtos.enums.VerificationStatus;
import com.webapplication.ss_app.entity.Catalog;
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
	 * Detalle de un perfil con cuenta, dueño y fotos cargadas.
	 */
	@Query("""
			SELECT DISTINCT p
			FROM Profile p
			JOIN FETCH p.account a
			LEFT JOIN FETCH a.owner
			LEFT JOIN FETCH p.photos
			WHERE p.id = :id
			""")
	Optional<Profile> findByIdWithAccountAndPhotos(@Param("id") Long id);

	@Query("SELECT s FROM Profile p JOIN p.services s WHERE p.id = :id ORDER BY s.name ASC")
	List<Catalog> findServicesByProfileId(@Param("id") Long id);

	@Query("SELECT d FROM Profile p JOIN p.departures d WHERE p.id = :id ORDER BY d.name ASC")
	List<Catalog> findDeparturesByProfileId(@Param("id") Long id);

	@Query("SELECT c FROM Profile p JOIN p.channels c WHERE p.id = :id ORDER BY c.name ASC")
	List<Catalog> findChannelsByProfileId(@Param("id") Long id);

	@Query("SELECT m FROM Profile p JOIN p.modalities m WHERE p.id = :id ORDER BY m.name ASC")
	List<Catalog> findModalitiesByProfileId(@Param("id") Long id);

	/**
	 * IDs paginados para el listado admin. No hace fetch de colecciones para
	 * que el paginado y el count se ejecuten correctamente en base de datos.
	 */
	@Query(value = """
			SELECT p.id
			FROM Profile p
			JOIN p.account a
			LEFT JOIN a.owner u
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
			""", countQuery = """
			SELECT COUNT(p)
			FROM Profile p
			JOIN p.account a
			LEFT JOIN a.owner u
			WHERE (
			        LOWER(p.profileName) LIKE :searchPattern
			        OR LOWER(a.userName) LIKE :searchPattern
			        OR LOWER(u.email) LIKE :searchPattern
			        OR LOWER(p.city) LIKE :searchPattern
			      )
			  AND (:accountType IS NULL OR a.type = :accountType)
			  AND (:status IS NULL OR p.status = :status)
			  AND (:verificationStatus IS NULL OR p.verificationStatus = :verificationStatus)
			""")
	Page<Long> findAdminProfileIds(@Param("searchPattern") String searchPattern,
			@Param("accountType") AccountType accountType, @Param("status") ProfileStatus status,
			@Param("verificationStatus") VerificationStatus verificationStatus, Pageable pageable);

	/**
	 * Carga completa de los perfiles de una página por IDs.
	 */
	@Query("""
			SELECT DISTINCT p
			FROM Profile p
			JOIN FETCH p.account a
			LEFT JOIN FETCH a.owner
			LEFT JOIN FETCH p.photos
			WHERE p.id IN :ids
			""")
	List<Profile> findByIdsWithAccountAndPhotos(@Param("ids") Collection<Long> ids);

	@Query("SELECT p.status, COUNT(p) FROM Profile p GROUP BY p.status")
	List<Object[]> countProfilesByStatus();

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
