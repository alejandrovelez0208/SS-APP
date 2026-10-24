package com.webapplication.ss_app.dtos.enums;

public enum Gender {
	MALE("Male"), FEMALE("Female"), NON_BINARY("Not Binary"), OTHER("Other");

	public final String displayName;

	Gender(String description) {
		this.displayName = description;
	}

	public String getDisplayName() {
		return displayName;
	}
}
