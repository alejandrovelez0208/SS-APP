package com.webapplication.ss_app.dtos.enums;

public enum ProfileStatus {

	ACTIVE("Active"), INACTIVE("Inactive"), PAUSED("Paused");

	public final String displayName;

	ProfileStatus(String description) {
		this.displayName = description;
	}

	public String getDisplayName() {
		return displayName;
	}
}
