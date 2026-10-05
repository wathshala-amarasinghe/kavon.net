export interface StoreOrderItem {
    image: string;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
}

export interface StoreOrder {
    _id: string;
    orderItems: StoreOrderItem[];
    createdAt: string;
    updatedAt: string;
    deliveredAt?: string;
    trackingId: string;
    status: string;
    statusHistory?: Array<{
        status: string;
        timestamp: string;
        note?: string;
    }>;
    itemsPrice: number;
    discountPrice: number;
    shippingPrice: number;
    totalPrice: number;
    paymentMethod: string;
    deliveryMethod: string;
    shippingAddress: {
        fullName: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
        phone: string;
    };
}
