
const ESTIMATED_TAX_RATE = 0.20;

/**
 * Calculates an illustrative tax estimate from recorded income.
 * This is not an official SARS tax calculation.
 */
function calculateTax(income) {
    const amount = Number(income);

    if (!Number.isFinite(amount) || amount < 0) {
        throw new Error('Income must be a valid non-negative number.');
    }

    const estimatedTax = Number(
        (amount * ESTIMATED_TAX_RATE).toFixed(2)
    );

    const afterTaxIncome = Number(
        (amount - estimatedTax).toFixed(2)
    );

    return {
        grossIncome: Number(amount.toFixed(2)),
        estimatedTax,
        afterTaxIncome,
        taxRate: ESTIMATED_TAX_RATE * 100
    };
}

module.exports = {
    calculateTax,
    ESTIMATED_TAX_RATE
};
