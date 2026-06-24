export type DeliverySector = "COLOMBO" | "OUTSTATION";

export const calculateTacticalShipping = (subtotal: number, sector: DeliverySector) => {
    if (subtotal === 0) return 0;

    const rates = {
        COLOMBO: { fee: 350, threshold: 10000 },
        OUTSTATION: { fee: 650, threshold: 15000 }
    };

    const activeRate = rates[sector];
    return subtotal >= activeRate.threshold ? 0 : activeRate.fee;
};