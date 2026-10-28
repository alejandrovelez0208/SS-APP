package com.webapplication.ss_app.entity;

import java.time.Instant;

import com.webapplication.ss_app.dtos.enums.MediaType;
import com.webapplication.ss_app.dtos.enums.ModerationStatus;
import com.webapplication.ss_app.dtos.enums.PhotoVisibility;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity
@Table(name = "profile_photo")
public class ProfilePhoto {

	@Id
	@GeneratedValue
	@EqualsAndHashCode.Include
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "profile_id", nullable = false)
	private Profile profile;

	@Column(nullable = false, length = 500)
	private String url; 

	@Column(length = 255)
	private String storageKey;
	
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private MediaType mediaType = MediaType.IMAGE;

	@Column(nullable = false)
	private Integer sortOrder = 0;

	@Column(nullable = false)
	private boolean primaryPhoto = false;

	@Enumerated(EnumType.STRING)
	@Column(name = "visibility", nullable = false, length = 20)
	private PhotoVisibility visibility = PhotoVisibility.PUBLIC;

	@Enumerated(EnumType.STRING)
	@Column(name = "moderation_status", nullable = false, length = 20)
	private ModerationStatus moderationStatus = ModerationStatus.PENDING;

	@Column(name = "rejection_reason", length = 255)
	private String rejectionReason;

	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	@PrePersist
	void onCreate() {
		createdAt = updatedAt = Instant.now();
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = Instant.now();
	}
}
