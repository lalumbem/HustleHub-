
const test = require('node:test');
const assert = require('node:assert/strict');

const {
    calculateTax
} = require('../src/utils/taxCalculator');

test('calculates estimated tax correctly', () => {
    const result = calculateTax(10000);

    assert.equal(result.grossIncome, 10000);
    assert.equal(result.estimatedTax, 2000);
    assert.equal(result.afterTaxIncome, 8000);
    assert.equal(result.taxRate, 20);
});

test('returns zero tax for zero income', () => {
    const result = calculateTax(0);

    assert.equal(result.estimatedTax, 0);
    assert.equal(result.afterTaxIncome, 0);
});

test('rejects negative income', () => {
    assert.throws(() => calculateTax(-100));
});

test('rejects invalid income', () => {
    assert.throws(() => calculateTax('invalid'));
});
