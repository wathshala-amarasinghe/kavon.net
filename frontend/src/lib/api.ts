import type { CatalogFacets } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const EMPTY_CATALOG_FACETS: CatalogFacets = {
  categories: [],
  genders: [],
  sizes: [],
  colors: [],
  maxPrice: 100000,
};

async function apiError(response: Response, fallback: string): Promise<Error> {
  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json().catch(() => null);
    return new Error(data?.message || fallback);
  }

  const message = (await response.text().catch(() => '')).trim();
  return new Error(message || fallback);
}

export async function getProducts(params: Record<string, unknown> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value as string);
    }
  });

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw await apiError(res, 'Catalog could not be loaded');

  const raw = await res.json();
  const data = raw && typeof raw === "object" ? raw : {};
  const products = Array.isArray(data.products) ? data.products : [];
  const total = Number.isFinite(Number(data.total)) ? Number(data.total) : products.length;
  const page = Number.isFinite(Number(data.page ?? data.currentPage))
    ? Number(data.page ?? data.currentPage)
    : 1;
  const pages = Number.isFinite(Number(data.pages ?? data.totalPages))
    ? Number(data.pages ?? data.totalPages)
    : 0;
  const rawFacets = data.facets && typeof data.facets === 'object' ? data.facets : {};
  const facets: CatalogFacets = {
    categories: Array.isArray(rawFacets.categories) ? rawFacets.categories.filter(Boolean) : [],
    genders: Array.isArray(rawFacets.genders) ? rawFacets.genders.filter(Boolean) : [],
    sizes: Array.isArray(rawFacets.sizes) ? rawFacets.sizes.filter(Boolean) : [],
    colors: Array.isArray(rawFacets.colors)
      ? rawFacets.colors.filter((color: unknown) => color && typeof color === 'object')
      : [],
    maxPrice: Number.isFinite(Number(rawFacets.maxPrice))
      ? Math.max(0, Number(rawFacets.maxPrice))
      : EMPTY_CATALOG_FACETS.maxPrice,
  };

  return {
    ...data,
    products,
    total,
    page,
    pages,
    totalPages: pages,
    currentPage: page,
    facets,
  };
}

export async function getProductById(id: string) {
  try {
    const res = await fetch(`${API_URL}/products/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.warn("API_FETCH_ERROR [getProductById]:", error);
    return null;
  }
}

export async function login(credentials: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json();
}

export async function register(userData: Record<string, unknown>) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }

  return res.json();
}

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/auth/password/forgot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw await apiError(res, 'Could not send recovery code');
  return res.json();
}

export async function verifyPasswordResetCode(email: string, code: string) {
  const res = await fetch(`${API_URL}/auth/password/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) throw await apiError(res, 'Recovery code is invalid or expired');
  return res.json();
}

export async function resetPassword(email: string, token: string, password: string) {
  const res = await fetch(`${API_URL}/auth/password/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, token, password }),
  });

  if (!res.ok) throw await apiError(res, 'Password reset failed');
  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function createOrder(orderData: Record<string, unknown>, token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData),
  });

  if (!res.ok) throw await apiError(res, 'Order creation failed');

  return res.json();
}

export async function validateCoupon(code: string, amount: number) {
  const res = await fetch(`${API_URL}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code: code.trim().toUpperCase(), amount }),
  });

  if (!res.ok) throw await apiError(res, 'Invalid promotion code');
  return res.json();
}

export async function getMyOrders(token: string) {
  const res = await fetch(`${API_URL}/orders/myorders`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch orders');
  }

  return res.json();
}

export async function getOrderById(id: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch order');
  }

  return res.json();
}

export async function getWishlist(token: string) {
  const res = await fetch(`${API_URL}/wishlist`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch wishlist');
  }

  return res.json();
}

export async function toggleWishlistApi(productId: string, token: string) {
  const res = await fetch(`${API_URL}/wishlist/toggle`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ productId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to toggle wishlist');
  }

  return res.json();
}

export async function updateProfile(userData: Record<string, unknown>, token: string) {
  const res = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Profile update failed');
  }

  return res.json();
}

export async function getProductReviews(productId: string) {
  const res = await fetch(`${API_URL}/reviews/${productId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to fetch reviews');
  }

  return res.json();
}

export async function createReview(reviewData: Record<string, unknown>, token: string) {
  const res = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reviewData),
  });

  if (!res.ok) throw await apiError(res, 'Review submission failed');

  return res.json();
}

export async function trackOrder(orderId: string, phone: string) {
  const res = await fetch(`${API_URL}/orders/track/${orderId}?phone=${encodeURIComponent(phone)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Tracking failed');
  }

  return res.json();
}

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    cache: "no-store",
  });

  if (!res.ok) throw await apiError(res, 'Site settings could not be loaded');
  return res.json();
}

export async function getCampaigns() {
  const res = await fetch(`${API_URL}/campaigns`, {
    cache: "no-store",
  });

  if (!res.ok) throw await apiError(res, 'Campaigns could not be loaded');
  return res.json();
}
