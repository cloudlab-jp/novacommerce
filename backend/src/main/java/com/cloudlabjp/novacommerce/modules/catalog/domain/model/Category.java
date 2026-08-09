package com.cloudlabjp.novacommerce.modules.catalog.domain.model;

import com.cloudlabjp.novacommerce.modules.shared.infrastructure.persistence.entity.JpaBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category extends JpaBaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name;

}