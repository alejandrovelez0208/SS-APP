package com.webapplication.ss_app.dtos.enums;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "catalog")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Catalog {

    @Id
    @EqualsAndHashCode.Include
    private Integer id;

    @Column(nullable = false)
    private Integer type;

    @Column(nullable = false)
    private Integer code;;
    
    @Column(nullable = false, length = 150)
    private String description;

    private Integer fathertype;

    @Column(nullable = false)
    private boolean active = true;
}
