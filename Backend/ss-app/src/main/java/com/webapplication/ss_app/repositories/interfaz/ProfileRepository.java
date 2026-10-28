package com.webapplication.ss_app.repositories.interfaz;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webapplication.ss_app.entity.Profile;

public interface ProfileRepository extends JpaRepository<Profile, Long> {

}
