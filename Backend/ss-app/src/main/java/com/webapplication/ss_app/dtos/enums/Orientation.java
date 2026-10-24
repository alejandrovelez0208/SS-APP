package com.webapplication.ss_app.dtos.enums;

public enum Orientation {

	HETEROSEXUAL("Heterosexual"), HOMOSEXUAL("Homosexual"), BISEXUAL("Bisexual"), ASEXUAL("Asexual"),
	PANSEXUAL("Pansexual"), QUEER("Queer"), QUESTIONING("Questioning"), OTHER("Other");

	private final String description;

	Orientation(String displayName) {
		this.description = displayName;
	}

	public String getDisplayName() {
		return description;
	}
}
