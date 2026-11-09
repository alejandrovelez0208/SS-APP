package com.webapplication.ss_app.repositories.interfaz;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.webapplication.ss_app.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	Optional<User> findByVerificationToken(String verificationToken);

	Optional<User> findByPasswordResetToken(String passwordResetToken);

	/**
	 * Lista el directorio con la cuenta asociada en una sola consulta (evita N+1).
	 */
	@Query("SELECT u FROM User u JOIN FETCH u.account ORDER BY u.idUsers ASC")
	List<User> findAllWithAccount();

	/**
	 * Carga un usuario junto con su cuenta para el detalle.
	 */
	@Query("SELECT u FROM User u JOIN FETCH u.account WHERE u.idUsers = :id")
	Optional<User> findWithAccountById(@Param("id") Long id);
}
