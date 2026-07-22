const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function apiError(response: Response, fallback: string): Promise<Error> {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    return new Error(data?.message || fallback);
  }

  const message = (await response.text().catch(() => "")).trim();
  return new Error(message || fallback);
}

// --- PRODUCT MANAGEMENT ---

export async function getProducts(params: any = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value as string);
    }
  });

  const res = await fetch(`${API_URL}/products?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) throw await apiError(res, "Catalog fetch failed");
  return res.json();
}

export async function getAllProducts(params: Record<string, unknown> = {}) {
  const firstPage = await getProducts({ ...params, page: 1, limit: 100 });
  const pageCount = Math.max(1, Number(firstPage.pages || 1));
  const remaining = pageCount > 1
    ? await Promise.all(
        Array.from({ length: pageCount - 1 }, (_, index) =>
          getProducts({ ...params, page: index + 2, limit: 100 })
        )
      )
    : [];

  return {
    ...firstPage,
    products: [
      ...(Array.isArray(firstPage.products) ? firstPage.products : []),
      ...remaining.flatMap((page) => Array.isArray(page.products) ? page.products : []),
    ],
  };
}

export async function createProduct(productData: any, token: string) {
  const res = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) throw await apiError(res, "Product creation failed");
  return res.json();
}

export async function updateProduct(id: string, productData: any, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) throw await apiError(res, "Product update failed");
  return res.json();
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw await apiError(res, "Asset termination failed");
  return res.json();
}

// --- ORDER COMMAND ---

export async function getOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });

  if (!res.ok) throw await apiError(res, "Logistics sync failed");
  return res.json();
}

export async function updateOrderToPaid(id: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/pay`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw await apiError(res, "Transaction verification failed");
  return res.json();
}

export async function updateOrderToDelivered(id: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/deliver`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw await apiError(res, "Deployment finalization failed");
  return res.json();
}

export async function updateOrderStatus(id: string, status: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw await apiError(res, "Status update failed");
  return res.json();
}

export async function updateOrderTracking(id: string, trackingData: any, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/tracking`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(trackingData),
  });

  if (!res.ok) throw await apiError(res, "Tracking update failed");
  return res.json();
}

// --- PERSONNEL OVERSIGHT ---

export async function getUsers(token: string) {
  const res = await fetch(`${API_URL}/auth`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });

  if (!res.ok) throw await apiError(res, "Personnel database sync failed");
  return res.json();
}

export async function deleteUser(id: string, token: string) {
  const res = await fetch(`${API_URL}/auth/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw await apiError(res, "Personnel termination failed");
  return res.json();
}

export async function updateUserRole(id: string, role: string, token: string) {
  const res = await fetch(`${API_URL}/auth/${id}/role`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ role }),
  });

  if (!res.ok) throw await apiError(res, "Clearance update failed");
  return res.json();
}

// --- CAMPAIGN MANAGEMENT ---

export async function getCampaigns() {
  const res = await fetch(`${API_URL}/campaigns`, { cache: "no-store" });
  if (!res.ok) throw await apiError(res, "Campaign sync failed");
  return res.json();
}

export async function createCampaign(campaignData: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw await apiError(res, "Campaign initialization failed");
  return res.json();
}

export async function updateCampaign(id: string, campaignData: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw await apiError(res, "Campaign modification failed");
  return res.json();
}

export async function deleteCampaign(id: string, token: string) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw await apiError(res, "Campaign termination failed");
  return res.json();
}

// --- COUPON MANAGEMENT ---

export async function getCoupons(token: string) {
  const res = await fetch(`${API_URL}/coupons`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw await apiError(res, "Coupon database sync failed");
  return res.json();
}

export async function createCoupon(couponData: any, token: string) {
  const res = await fetch(`${API_URL}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(couponData),
  });
  if (!res.ok) throw await apiError(res, "Incentive generation failed");
  return res.json();
}

export async function updateCoupon(id: string, couponData: any, token: string) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(couponData),
  });
  if (!res.ok) throw await apiError(res, "Incentive modification failed");
  return res.json();
}

export async function deleteCoupon(id: string, token: string) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw await apiError(res, "Incentive termination failed");
  return res.json();
}

// --- SYSTEM CONFIGURATION ---

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    cache: "no-store",
  });

  if (!res.ok) throw await apiError(res, "Settings sync failed");
  return res.json();
}

export async function updateSettings(settingsData: any, token: string) {
  const res = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(settingsData),
  });

  if (!res.ok) throw await apiError(res, "Settings modification failed");
  return res.json();
}

// --- AUTHORIZATION ---

export async function login(credentials: any) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Authorization failed");
  }

  const data = await res.json();
  
  // Verify role
  if (data.user.role !== 'admin') {
    throw new Error("ACCESS_DENIED: Personnel lack administrative clearance");
  }

  return data;
}

export async function getAdminSession(token: string) {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) throw await apiError(res, 'Administrative session expired');
  const user = await res.json();
  if (user.role !== 'admin') throw new Error('Administrative access is required');
  return user;
}

// --- FILE UPLOAD ---

export async function uploadImage(file: File, token: string) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}` 
    },
    body: formData,
  });

  if (!res.ok) throw await apiError(res, "Image upload failed");

  return res.json();
}
