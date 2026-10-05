/**
 * KAVON BUNDLE_PROTOCOL
 * If User buys more than 2 items, apply bulk discount.
 * If specific set items (Tee + Pant) are present, apply set discount.
 */

export const calculateBundleSynergy = (cart: { quantity: number; price: number; category?: string }[]) => {
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // Protocol 01: Bulk Acquisition (3+ items = 5% off)
    if (totalItems >= 3) {
        return {
            label: "BULK_LOGISTICS_DISCOUNT",
            discount: subtotal * 0.05,
            rate: 5
        };
    }

    // Protocol 02: Tactical Set (If specific categories match)
    const hasTee = cart.some(i => i.category?.toLowerCase().includes('oversized'));
    const hasHoodie = cart.some(i => i.category?.toLowerCase().includes('hoodie'));

    if (hasTee && hasHoodie) {
        return {
            label: "TACTICAL_SET_SYNERGY",
            discount: subtotal * 0.08,
            rate: 8
        };
    }

    return null;
};