package com.mav.apigateway.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "gateway.security")
@Getter
@Setter
public class GatewaySecurityProperties {
    
    private List<String> publicPaths = new ArrayList<>();
}
