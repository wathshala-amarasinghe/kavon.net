"use client";

import React, { useState } from 'react';
import { ArrowRight, Ticket } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth, Order } from '@/context/AuthContext';
import { FormattedPrice } from '@/components/ui/FormattedPrice';
import { createOrder } from '@/lib/api';

import { useCheckout } from '@/context/CheckoutContext';
import { DeliverySector } from '@/lib/logistics';

export function OrderSummary({ 
    selectedDeliveryPrice = 0, 
    deliveryMethod = 'standard',
    deliverySector = 'COLOMBO',
    isFinalStep = false 
}: { 
    selectedDeliveryPrice?: number;
    deliveryMethod?: string;
    deliverySector?: DeliverySector;
    isFinalStep?: boolean;
}) {
    const router = useRouter();
    const { cart, subtotal: cartSubtotal, discount: cartDiscount, applyCoupon, activeCoupon, couponError, getCouponDiscount, clearCart, isPointsRedeemed, setIsPointsRedeemed, pointsDiscount: cartPointsDiscount } = useCart();
    const { activeCheckoutItem, clearBuyNowItem, shippingAddress, paymentMethod } = useCheckout();
    const { addOrderToHistory, loyaltyPoints, deductPoints } = useAuth();
    const [couponInput, setCouponInput] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

    // 1. Determine the Active Manifest (Buy Now vs Cart)
    const activeItems = activeCheckoutItem ? [activeCheckoutItem] : cart;
    const subtotal = (activeCheckoutItem ? (activeCheckoutItem.price * activeCheckoutItem.quantity) : cartSubtotal) || 0;
    
    // Apply discount logic to the active subtotal
    const discount = (activeCheckoutItem ? getCouponDiscount(subtotal) : cartDiscount) || 0;
    const pointsDiscount = (activeCheckoutItem ? (isPointsRedeemed ? (subtotal - discount) * 0.05 : 0) : cartPointsDiscount) || 0;

    // Calculate final total with dynamic shipping
    const finalPayable = Math.max(0, (subtotal - discount - pointsDiscount) + (selectedDeliveryPrice || 0));

    const handleApply = async () => {
        if (!couponInput.trim() || isApplyingCoupon) return;
        setIsApplyingCoupon(true);
        if (await applyCoupon(couponInput, subtotal)) {
            setCouponInput("");
        }
        setIsApplyingCoupon(false);
    };

    const handleConfirm = async () => {
        const token = localStorage.getItem('kavon-token-v1');
        if (!token) {
            alert("AUTH_REQUIRED: Please sign in to proceed with deployment.");
            router.push('/login');
            return;
        }

        if (!shippingAddress) {
            alert('SHIPPING_REQUIRED: Please complete your delivery address.');
            return;
        }

        if (paymentMethod !== 'cod') {
            alert('PAYMENT_UNAVAILABLE: Card payments are not active yet.');
            return;
        }

        setIsProcessing(true);
        try {
            // 1. Prepare Order Protocol Data
            const orderData = {
                orderItems: activeItems.map(item => ({
                    product: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    image: item.image,
                    price: item.price,
                    size: item.size,
                    color: item.color || "Default",
                    isBundle: Boolean(item.isBundle),
                })),
                shippingAddress: {
                    fullName: shippingAddress.fullName,
                    address: shippingAddress.address,
                    city: shippingAddress.city,
                    postalCode: shippingAddress.postalCode,
                    country: shippingAddress.country,
                    phone: shippingAddress.phone,
                    secondaryPhone: shippingAddress.secondaryPhone || '',
                },
                paymentMethod,
                deliveryMethod,
                deliverySector,
                couponCode: activeCoupon,
                pointsUsed: isPointsRedeemed ? 1000 : 0,
            };

            // 2. Transmit to Backend
            const createdOrder = await createOrder(orderData, token);

            // 3. Update Local State Protocol
            addOrderToHistory({
                id: createdOrder._id,
                items: activeItems,
                totals: { subtotal, discount: discount + pointsDiscount, shipping: selectedDeliveryPrice, total: finalPayable },
                date: createdOrder.createdAt,
                status: 'Authorized',
                pointsBurned: isPointsRedeemed ? 1000 : 0
            });

            if (isPointsRedeemed) {
                deductPoints(1000);
                setIsPointsRedeemed(false);
            }

            localStorage.setItem('kavon_last_order', JSON.stringify(createdOrder));
            
            // Only clear cart if it was a cart checkout
            if (!activeCheckoutItem) {
                clearCart();
            } else {
                clearBuyNowItem();
            }
            
            setTimeout(() => {
                router.push('/order-success');
            }, 100);
        } catch (error: unknown) {
            console.error('DEPLOYMENT_FAILURE:', error);
            alert(`DEPLOYMENT_ERROR: ${error instanceof Error ? error.message : "Unknown error"}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-brand-surface border border-white/10 p-8 space-y-8 backdrop-blur-xl sticky top-32">
            <h3 className="font-mono text-[10px] tracking-[0.4em] text-white/30 uppercase">Order_Summary</h3>

            <div className="space-y-4 border-b border-white/5 pb-8">
                <div className="flex justify-between text-xs tracking-widest uppercase">
                    <span className="text-white/40">Subtotal</span>
                    <span><FormattedPrice amount={subtotal} /></span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-xs tracking-widest uppercase text-brand-volt">
                        <span>Discount</span>
                        <span>-<FormattedPrice amount={discount} /></span>
                    </div>
                )}
                <div className="flex justify-between text-xs tracking-widest uppercase">
                    <span className="text-white/40">Selected_Deployment</span>
                    <span className={selectedDeliveryPrice === 0 ? "text-brand-volt" : ""}>
                        {selectedDeliveryPrice === 0 ? "FREE" : <FormattedPrice amount={selectedDeliveryPrice} />}
                    </span>
                </div>
                {pointsDiscount > 0 && (
                    <div className="flex justify-between text-xs tracking-widest uppercase text-brand-volt">
                        <span className="flex items-center gap-2">POINTS_REWARD (5%)</span>
                        <span>-<FormattedPrice amount={pointsDiscount} /></span>
                    </div>
                )}
                <div className="flex justify-between text-xs tracking-widest uppercase pt-2 border-t border-white/5">
                    <span className="text-white/40">Earned_Credits</span>
                    <span className="text-brand-volt">+{Math.floor(subtotal * 0.25)} CRD</span>
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-[9px] font-mono text-white/30 uppercase tracking-widest">Promotion_Node</label>
                <div className="flex gap-2">
                    <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} placeholder="ENTER CODE" className="flex-1 bg-white/5 border border-white/10 p-3 font-mono text-[10px] focus:border-brand-volt outline-none text-white" />
                    <button onClick={handleApply} className="px-4 border border-brand-volt text-brand-volt hover:bg-brand-volt hover:text-black transition-all">
                        {isApplyingCoupon ? <span className="text-[9px] font-mono">...</span> : <Ticket size={16} />}
                    </button>
                </div>
                {couponError && (
                    <p role="alert" className="text-[10px] font-mono text-red-400 uppercase tracking-wide">
                        {couponError}
                    </p>
                )}

                {/* Points Redemption Section */}
                {loyaltyPoints >= 1000 && (
                    <div className="pt-4">
                        <button 
                            onClick={() => setIsPointsRedeemed(!isPointsRedeemed)}
                            className={`w-full py-3 px-4 border flex items-center justify-between transition-all ${isPointsRedeemed ? 'bg-brand-volt border-brand-volt text-black' : 'border-white/10 text-white/50 hover:border-brand-volt hover:text-brand-volt'}`}
                        >
                            <span className="font-mono text-[9px] uppercase tracking-widest font-bold">
                                {isPointsRedeemed ? 'CREDITS_ACTIVE: -1000 CRD' : 'BURN 1000 CREDITS?'}
                            </span>
                            <span className="font-bold text-[10px]">
                                {isPointsRedeemed ? 'REMOVE' : 'GET 5% OFF'}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end pt-4">
                <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.5em]">Total_Payable</span>
                <span className="text-3xl font-heading italic text-brand-volt leading-none tracking-tighter">
                    <FormattedPrice amount={finalPayable} />
                </span>
            </div>

            {isFinalStep ? (
                <button 
                    onClick={handleConfirm}
                    disabled={isProcessing}
                    className="w-full bg-white text-black py-6 flex items-center justify-center gap-4 group relative overflow-hidden transition-all disabled:opacity-50"
                >
                    <div className="absolute inset-0 bg-brand-volt translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.9,0,0.1,1]" />
                    <span className="relative z-10 font-black text-xs uppercase tracking-[0.4em]">
                        {isProcessing ? "Deploying_Assets..." : "Confirm_Deployment"}
                    </span>
                    {!isProcessing && <ArrowRight size={16} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
                </button>
            ) : (
                <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest leading-relaxed">
                        Complete the address and delivery steps to activate the deployment protocol.
                    </p>
                </div>
            )}
        </div>
    );
}
