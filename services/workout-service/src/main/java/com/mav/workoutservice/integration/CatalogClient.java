package com.mav.workoutservice.integration;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CatalogClient {
    
    private final RestClient.Builder restClientBuilder;
    
    @Value("${app.catalog-service.url}")
    private String catalogServiceUrl;
    
    public ExerciseDto getExercise(UUID exerciseId) {
        RestClient client = restClientBuilder.baseUrl(catalogServiceUrl).build();
        return client.get()
                .uri("/internal/exercises/{id}", exerciseId)
                .retrieve()
                .body(ExerciseDto.class);
    }
    
    public ExerciseDto getExerciseBySlug(String slug) {
        RestClient client = restClientBuilder.baseUrl(catalogServiceUrl).build();
        return client.get()
                .uri("/internal/exercises/slug/{slug}", slug)
                .retrieve()
                .body(ExerciseDto.class);
    }
    
    public List<ExerciseDto> getExercisesByIds(List<UUID> ids) {
        RestClient client = restClientBuilder.baseUrl(catalogServiceUrl).build();
        String idsParam = String.join(",", ids.stream().map(UUID::toString).toList());
        return client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/exercises/ids")
                        .queryParam("ids", idsParam)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<List<ExerciseDto>>() {});
    }
}
