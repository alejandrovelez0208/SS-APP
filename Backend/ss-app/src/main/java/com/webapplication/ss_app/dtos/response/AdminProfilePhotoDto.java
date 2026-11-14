package com.webapplication.ss_app.dtos.response;

import java.io.Serializable;

import com.webapplication.ss_app.dtos.enums.ModerationStatus;
import com.webapplication.ss_app.dtos.enums.PhotoVisibility;

import lombok.Data;

@Data
public class AdminProfilePhotoDto implements Serializable {

	private static final long serialVersionUID = 391713961209608967L;

	private Long id;
	private String url;
	private boolean primaryPhoto;
	private Integer sortOrder;
	private PhotoVisibility visibility;
	private ModerationStatus moderationStatus;
}
