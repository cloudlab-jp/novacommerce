package com.cloudlabjp.novacommerce.modules.catalog.domain.repository;

import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
