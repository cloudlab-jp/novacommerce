package com.cloudlabjp.novacommerce.modules.sales.domain.repository;

import com.cloudlabjp.novacommerce.modules.sales.domain.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
}