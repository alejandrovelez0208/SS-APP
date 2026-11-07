package com.webapplication.ss_app.dtos.enums;

public enum CatalogType {
	CATEGORY("Root Category / Main"), CHANNEL("Channels Communication"), MODALITY("Service Modality"),
	SERVICE("Services and Practices"), TRAVEL("Trips and Movements");

	private final String label;

	CatalogType(String label) {
		this.label = label;
	}

	public String getLabel() {
		return label;
	}
}
