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
@Slf4j
public class CatalogClient {
    
    private final RestClient restClient;
    
    public CatalogClient(RestClient.Builder restClientBuilder,
                         @Value("${app.catalog-service.url}") String catalogServiceUrl) {
        this.restClient = restClientBuilder
                .baseUrl(catalogServiceUrl)
                .build();
    }
    
    public ExerciseDto getExercise(UUID exerciseId) {
        return restClient.get()
                .uri("/internal/exercises/{id}", exerciseId)
                .retrieve()
                .body(ExerciseDto.class);
    }
    
    public ExerciseDto getExerciseBySlug(String slug) {
        return restClient.get()
                .uri("/internal/exercises/slug/{slug}", slug)
                .retrieve()
                .body(ExerciseDto.class);
    }
    
    public List<ExerciseDto> getExercisesByIds(List<UUID> ids) {
        // Преобразуем List<UUID> в строку через запятую для query-параметра
        String idsParam = String.join(",", ids.stream().map(UUID::toString).toList());
        
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/internal/exercises/ids")
                        .queryParam("ids", idsParam)
                        .build())
                .retrieve()
                .body(new ParameterizedTypeReference<List<ExerciseDto>>() {});
    }
}
