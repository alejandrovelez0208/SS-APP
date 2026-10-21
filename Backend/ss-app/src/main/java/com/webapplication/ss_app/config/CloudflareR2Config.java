package com.webapplication.ss_app.config;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.http.urlconnection.UrlConnectionHttpClient;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

@Configuration
public class CloudflareR2Config {

	@Value("${cloudflare.r2.endpoint}")
	private String endpoint;

	@Value("${cloudflare.r2.access-key}")
	private String accessKey;

	@Value("${cloudflare.r2.secret-key}")
	private String secretKey;

	@Bean
	public S3Client s3Client() {
		AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);

		return S3Client.builder().endpointOverride(URI.create(endpoint)).region(Region.of("auto"))
				.credentialsProvider(StaticCredentialsProvider.create(credentials))
				.serviceConfiguration(
						S3Configuration.builder().pathStyleAccessEnabled(true).chunkedEncodingEnabled(false).build())
				.httpClientBuilder(UrlConnectionHttpClient.builder()).build();
	}
}
