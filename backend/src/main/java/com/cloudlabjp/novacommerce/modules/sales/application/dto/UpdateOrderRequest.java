package com.cloudlabjp.novacommerce.modules.sales.application.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public class UpdateOrderRequest {

    @NotNull
    private UUID customerId;

    private List<UUID> productIds;

    @NotNull
    private UUID categoryId;

    public UUID getCustomerId() {
        return customerId;
    }

    public void setCustomerId(UUID customerId) {
        this.customerId = customerId;
    }

    public List<UUID> getProductIds() {
        return productIds;
    }

    public void setProductIds(List<UUID> productIds) {
        this.productIds = productIds;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(UUID categoryId) {
        this.categoryId = categoryId;
    }
}