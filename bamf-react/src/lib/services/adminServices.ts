// ============================================
// File: lib/services/adminServices.ts
// ============================================
import { apiClient } from '@/lib/api-client';

// ========== Types ==========
export interface Admin {
    id: number;
    username: string;
}

export interface User {
    id: number;
    email: string;
    cart?: string | object;
}

export interface Review {
    id: number;
    productId: number;
    rating: number;
    title: string;
    comment: string;
    createdUtc: string;
}

export interface Item {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    variantId?: number;
}

export interface Order {
    id: number;
    orderNo: string;
    email: string;
    total: number;
    status: string;
    createdUtc: string;
    items?: Item[];
}

export interface Variant {
    id: string;
    sku: string;
    color: string;
    size: string;
    price: number;
    inventoryQuantity: number;
    lowStockThreshold: number;
    lastRestockDate: string | null;
}

export interface Group {
    id: string | number;
    name: string;
    slug?: string;
    objectId?: string;
    isDeleted?: boolean;
    category?: Category;
    categoryId?: string | number;
}

export interface Category {
    id: string | number;
    name: string;
    slug: string;
}

// ========== Helper function to build query strings ==========
const buildQueryString = (params: Record<string, any>): string => {
    const queryParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
    return queryParams ? `?${queryParams}` : '';
};

// ========== Admin Service ==========
export const adminService = {
    getAll: (page: number) => apiClient.get<Admin[]>(`/api/Admins?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/Admins/count'),
    getById: (id: number) => apiClient.get<Admin>(`/api/Admins/${id}`),
    create: (username: string, password: string) =>
        apiClient.post<Admin>(`/api/Admins?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`),
    delete: (id: number | string, confirmPassword?: string) =>
        apiClient.delete(`/api/Admins/${id}${confirmPassword ? `?confirmPassword=${encodeURIComponent(confirmPassword)}` : ''}`),
    updatePassword: (id: number | string, currentPassword: string, newPassword: string) =>
        apiClient.put(`/api/Admins/${id}/password?currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`),
};

// ========== User Management Service ==========
export const userService = {
    getAll: (page: number = 1) => apiClient.get<User[]>(`/api/UserManagement?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/UserManagement/count'),
    getById: (id: number) => apiClient.get<User>(`/api/UserManagement/${id}`),
    update: (id: number, name: string, email: string) =>
        apiClient.put<User>(`/api/UserManagement/${id}?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`),
    delete: (id: number) => apiClient.delete(`/api/UserManagement/${id}`),
};

// ========== Review Service ==========
export const reviewService = {
    getAll: (page: number = 1) => apiClient.get<Review[]>(`/api/Reviews?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/Reviews/count'),
    getById: (id: number) => apiClient.get<Review>(`/api/Reviews/${id}`),
    getByProduct: (productId: number) =>
        apiClient.get<Review[]>(`/api/Reviews/product/${productId}`),
    create: (productId: number, rating: number, title: string, comment: string) =>
        apiClient.post<Review>(`/api/Reviews?productId=${productId}&rating=${rating}&title=${encodeURIComponent(title)}&comment=${encodeURIComponent(comment)}`),
    update: (id: number, rating: number, title: string, comment: string) =>
        apiClient.put<Review>(`/api/Reviews/${id}?rating=${rating}&title=${encodeURIComponent(title)}&comment=${encodeURIComponent(comment)}`),
    delete: (id: number) => apiClient.delete(`/api/Reviews/${id}`),
};

// ========== Order Service ==========
export const orderService = {
    getAll: (page: number = 1) => apiClient.get<Order[]>(`/api/Orders?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/Orders/count'),
    getById: (id: number) => apiClient.get<Order>(`/api/Orders/${id}`),
    getByEmail: (email: string) =>
        apiClient.get<Order[]>(`/api/Orders/by-email/${encodeURIComponent(email)}`),
    getByOrderNo: (orderNo: string) =>
        apiClient.get<Order>(`/api/Orders/by-orderNo/${encodeURIComponent(orderNo)}`),
    create: (orderNo: string, email: string, total: number, status: string, customerName?: string) => {
        const params = buildQueryString({ orderNo, email, total, status, customerName });
        return apiClient.post<Order>(`/api/Orders${params}`);
    },
    update: (id: number, orderNo?: string, email?: string, total?: number, status?: string, customerName?: string) => {
        const params = buildQueryString({ orderNo, email, total, status, customerName });
        return apiClient.put<Order>(`/api/Orders/${id}${params}`);
    },
    delete: (id: number) => apiClient.delete(`/api/Orders/${id}`),
};

// ========== Groups Service ==========
export const groupService = {
    getAll: (page: number = 1) => apiClient.get<Group[]>(`/api/admin/Groups?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/admin/Groups/count'),
    create: (name: string, slug: string, description?: string, isActive: boolean = true) => {
        const params = buildQueryString({ name, slug, description, isActive });
        return apiClient.post<Group>(`/api/admin/Groups${params}`);
    },
    update: (id: number, name?: string, slug?: string, description?: string, isActive?: boolean) => {
        const params = buildQueryString({ name, slug, description, isActive });
        return apiClient.put<Group>(`/api/admin/Groups/${id}${params}`);
    },
    delete: (id: number | string) => apiClient.delete(`/api/admin/Groups/${id}`),
};

// ========== Variants Service ==========
export const variantService = {
    getByGroup: (groupId: number | string, page: number = 1) =>
        apiClient.get<Variant[]>(`/api/admin/variants/by-group/${groupId}?page=${page}`),
    getByGroupCount: (groupId: number | string) =>
        apiClient.get<number>(`/api/admin/variants/by-group/count?groupId=${groupId}`),
    create: (groupId: number | string, sku: string, color: string, size: string, price: number, inventoryQuantity: number, lowStockThreshold: number = 0) => {
        const params = buildQueryString({
            groupId,
            sku,
            color,
            size,
            price,
            inventoryQuantity,
            lowStockThreshold
        });
        return apiClient.post<Variant>(`/api/admin/variants${params}`);
    },
    update: (id: string, sku?: string, color?: string, size?: string, price?: number, inventoryQuantity?: number, lowStockThreshold?: number) => {
        const params = buildQueryString({
            sku,
            color,
            size,
            price,
            inventoryQuantity,
            lowStockThreshold
        });
        return apiClient.put<Variant>(`/api/admin/variants/${id}${params}`);
    },
    delete: (id: string) => apiClient.delete(`/api/admin/variants/${id}`),
    adjustInventory: (id: string, adjustment: number) =>
        apiClient.post(`/api/admin/variants/${id}/inventory/adjust?adjustment=${adjustment}`),
};

// ========== Categories Service ==========
export const categoryService = {
    getAll: (page: number = 1) => apiClient.get<Category[]>(`/api/Categories?page=${page}`),
    getAllCount: () => apiClient.get<number>('/api/Categories/count'),
};