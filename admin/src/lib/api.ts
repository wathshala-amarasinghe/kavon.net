const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

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

  if (!res.ok) throw new Error("Catalog fetch failed");
  return res.json();
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

  if (!res.ok) throw new Error("Manifest authorization failed");
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

  if (!res.ok) throw new Error("Asset modification failed");
  return res.json();
}

export async function deleteProduct(id: string, token: string) {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Asset termination failed");
  return res.json();
}

// --- ORDER COMMAND ---

export async function getOrders(token: string) {
  const res = await fetch(`${API_URL}/orders`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Logistics sync failed");
  return res.json();
}

export async function updateOrderToPaid(id: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/pay`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Transaction verification failed");
  return res.json();
}

export async function updateOrderToDelivered(id: string, token: string) {
  const res = await fetch(`${API_URL}/orders/${id}/deliver`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Deployment finalization failed");
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

  if (!res.ok) throw new Error("Status update failed");
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

  if (!res.ok) throw new Error("Tracking update failed");
  return res.json();
}

// --- PERSONNEL OVERSIGHT ---

export async function getUsers(token: string) {
  const res = await fetch(`${API_URL}/auth`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });

  if (!res.ok) throw new Error("Personnel database sync failed");
  return res.json();
}

export async function deleteUser(id: string, token: string) {
  const res = await fetch(`${API_URL}/auth/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Personnel termination failed");
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

  if (!res.ok) throw new Error("Clearance update failed");
  return res.json();
}

// --- CAMPAIGN MANAGEMENT ---

export async function getCampaigns() {
  const res = await fetch(`${API_URL}/campaigns`, { cache: "no-store" });
  if (!res.ok) throw new Error("Campaign sync failed");
  return res.json();
}

export async function createCampaign(campaignData: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw new Error("Campaign initialization failed");
  return res.json();
}

export async function updateCampaign(id: string, campaignData: any, token: string) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(campaignData),
  });
  if (!res.ok) throw new Error("Campaign modification failed");
  return res.json();
}

export async function deleteCampaign(id: string, token: string) {
  const res = await fetch(`${API_URL}/campaigns/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Campaign termination failed");
  return res.json();
}

// --- COUPON MANAGEMENT ---

export async function getCoupons(token: string) {
  const res = await fetch(`${API_URL}/coupons`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: "no-store"
  });
  if (!res.ok) throw new Error("Coupon database sync failed");
  return res.json();
}

export async function createCoupon(couponData: any, token: string) {
  const res = await fetch(`${API_URL}/coupons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(couponData),
  });
  if (!res.ok) throw new Error("Incentive generation failed");
  return res.json();
}

export async function updateCoupon(id: string, couponData: any, token: string) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify(couponData),
  });
  if (!res.ok) throw new Error("Incentive modification failed");
  return res.json();
}

export async function deleteCoupon(id: string, token: string) {
  const res = await fetch(`${API_URL}/coupons/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Incentive termination failed");
  return res.json();
}

// --- SYSTEM CONFIGURATION ---

export async function getSettings() {
  const res = await fetch(`${API_URL}/settings`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Settings sync failed");
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

  if (!res.ok) throw new Error("Settings modification failed");
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

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Image upload failed");
  }

  return res.json();
}
