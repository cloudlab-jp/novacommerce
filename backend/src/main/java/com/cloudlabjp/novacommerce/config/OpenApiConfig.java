package com.cloudlabjp.novacommerce.config;

import io.swagger.v3.oas.models.ExternalDocumentation;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI novaCommerceOpenAPI() {

        return new OpenAPI()

                .info(
                        new Info()
                                .title("NovaCommerce API")
                                .description("REST API for NovaCommerce e-commerce platform.")
                                .version("v1.0.0")

                                .contact(
                                        new Contact()
                                                .name("CloudLab JP")
                                                .url("https://github.com/cloudlab-jp")
                                                .email("jpospina00@hotmail.com")
                                )

                                .license(
                                        new License()
                                                .name("MIT")
                                )
                )

                .externalDocs(
                        new ExternalDocumentation()
                                .description("Project Documentation")
                                .url("https://github.com/cloudlab-jp/novacommerce")
                );

    }

}