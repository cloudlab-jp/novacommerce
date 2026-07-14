import { describe, it, expect } from 'vitest';
import { roleHasPermission } from './auth';

describe('RBAC matrix', () => {
  it('guest can only browse catalog', () => {
    expect(roleHasPermission('guest', 'catalog:browse')).toBe(true);
    expect(roleHasPermission('guest', 'catalog:manage')).toBe(false);
  });

  it('catalog_manager can manage catalog but not inventory or orders', () => {
    expect(roleHasPermission('catalog_manager', 'catalog:manage')).toBe(true);
    expect(roleHasPermission('catalog_manager', 'inventory:manage')).toBe(false);
    expect(roleHasPermission('catalog_manager', 'orders:manage')).toBe(false);
  });

  it('inventory_manager can update stock but not manage catalog', () => {
    expect(roleHasPermission('inventory_manager', 'inventory:manage')).toBe(true);
    expect(roleHasPermission('inventory_manager', 'catalog:manage')).toBe(false);
  });

  it('order_manager can manage orders only', () => {
    expect(roleHasPermission('order_manager', 'orders:manage')).toBe(true);
    expect(roleHasPermission('order_manager', 'catalog:manage')).toBe(false);
    expect(roleHasPermission('order_manager', 'inventory:manage')).toBe(false);
  });

  it('admin has every permission', () => {
    expect(roleHasPermission('admin', 'catalog:manage')).toBe(true);
    expect(roleHasPermission('admin', 'inventory:manage')).toBe(true);
    expect(roleHasPermission('admin', 'orders:manage')).toBe(true);
    expect(roleHasPermission('admin', 'users:manage')).toBe(true);
  });

  it('customer cannot access any admin permission', () => {
    expect(roleHasPermission('customer', 'catalog:manage')).toBe(false);
    expect(roleHasPermission('customer', 'inventory:manage')).toBe(false);
    expect(roleHasPermission('customer', 'orders:manage')).toBe(false);
    expect(roleHasPermission('customer', 'users:manage')).toBe(false);
  });
});
