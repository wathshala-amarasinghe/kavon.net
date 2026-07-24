import assert from 'node:assert/strict';
import test from 'node:test';
import { calculateTacticalShipping } from './logistics.ts';

test('uses the Colombo standard-delivery rate and threshold', () => {
    assert.equal(calculateTacticalShipping(0, 'COLOMBO'), 0);
    assert.equal(calculateTacticalShipping(9999, 'COLOMBO'), 350);
    assert.equal(calculateTacticalShipping(10000, 'COLOMBO'), 0);
});

test('uses the outstation standard-delivery rate and threshold', () => {
    assert.equal(calculateTacticalShipping(14999, 'OUTSTATION'), 650);
    assert.equal(calculateTacticalShipping(15000, 'OUTSTATION'), 0);
});
