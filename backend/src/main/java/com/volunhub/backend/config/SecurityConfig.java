package com.volunhub.backend.config;

import com.volunhub.backend.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class SecurityConfig {

    private static final List<String> DEFAULT_ALLOWED_ORIGINS = List.of(
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "https://volun-hub.vercel.app"
    );

    @Bean
    public SecurityFilterChain securityFilterChain(
        HttpSecurity http,
        JwtAuthenticationFilter jwtAuthenticationFilter,
        AuthenticationProvider authenticationProvider
    ) throws Exception {
        http
            .cors(cors -> {})
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/auth/**", "/categorias/**", "/error").permitAll()
                .requestMatchers(HttpMethod.GET, "/projetos", "/projetos/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/projetos").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.PUT, "/projetos/**").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.DELETE, "/projetos/**").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.POST, "/inscricoes").hasRole("VOLUNTARIO")
                .requestMatchers(HttpMethod.GET, "/inscricoes/me").hasRole("VOLUNTARIO")
                .requestMatchers(HttpMethod.GET, "/inscricoes/projeto/**").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.PUT, "/inscricoes/**").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.POST, "/historico").hasRole("ORGANIZACAO")
                .requestMatchers(HttpMethod.GET, "/historico/me").hasRole("VOLUNTARIO")
                .requestMatchers(HttpMethod.GET, "/historico/projeto/**").hasRole("ORGANIZACAO")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(
        UserDetailsService userDetailsService,
        PasswordEncoder passwordEncoder
    ) {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailsService);
        authenticationProvider.setPasswordEncoder(passwordEncoder);
        return authenticationProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(buildAllowedOrigins());
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private static List<String> buildAllowedOrigins() {
        List<String> allowedOrigins = new ArrayList<>(DEFAULT_ALLOWED_ORIGINS);
        String frontendUrl = System.getenv("FRONTEND_URL");

        if (frontendUrl != null && !frontendUrl.isBlank()) {
            Arrays.stream(frontendUrl.split(","))
                .map(SecurityConfig::normalizeOrigin)
                .filter(origin -> !origin.isBlank())
                .forEach(allowedOrigins::add);
        }

        return allowedOrigins.stream().distinct().toList();
    }

    private static String normalizeOrigin(String origin) {
        String normalizedOrigin = origin.trim();

        while (normalizedOrigin.endsWith("/")) {
            normalizedOrigin = normalizedOrigin.substring(0, normalizedOrigin.length() - 1);
        }

        return normalizedOrigin;
    }
}
