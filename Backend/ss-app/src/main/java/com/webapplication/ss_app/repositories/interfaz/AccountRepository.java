package com.webapplication.ss_app.repositories.interfaz;

import org.springframework.data.jpa.repository.JpaRepository;

import com.webapplication.ss_app.entity.Account;

public interface AccountRepository extends JpaRepository<Account, Long>{

}
