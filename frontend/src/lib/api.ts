const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getProducts(params: Record<string, unknown> = {}) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.append(key, value as string);
      }
    });

    const res = await fetch(`${API_URL}/products?${query.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { products: [], totalPages: 0, currentPage: 1 };
    }

    return res.json();
  } catch (error) {
    console.warn("API_FETCH_ERROR [getProducts]:", error);
    return { products: [], totalPages: 0, currentPage: 1 };
  }
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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Order creation failed');
  }

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

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Review submission failed');
  }

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
  try {
    const res = await fetch(`${API_URL}/settings`, {
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    // Gracefully handle network errors without throwing
    return null;
  }
}

export async function getCampaigns() {
  try {
    const res = await fetch(`${API_URL}/campaigns`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}
