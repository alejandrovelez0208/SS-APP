package com.webapplication.ss_app.dtos.enums;

public enum PhotoVisibility {

	PUBLIC("Public"), PRIVATE("Private");

	public final String displayName;

	PhotoVisibility(String description) {
		this.displayName = description;
	}

	public String getDisplayName() {
		return displayName;
	}
}
