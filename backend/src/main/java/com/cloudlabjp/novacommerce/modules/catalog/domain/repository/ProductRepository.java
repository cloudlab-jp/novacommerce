package com.cloudlabjp.novacommerce.modules.catalog.domain.repository;

import com.cloudlabjp.novacommerce.modules.catalog.domain.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
}
