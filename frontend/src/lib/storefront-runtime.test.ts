import assert from 'node:assert/strict';
import test from 'node:test';
import {
    cartsAreEqual,
    getFirstAvailableSize,
    getSafeRedirect,
    normalizeCartItems,
    normalizeWishlistItem,
    sameCartLine,
} from './storefront-runtime.ts';

test('normalizes persisted cart data and rejects invalid lines', () => {
    assert.deepEqual(normalizeCartItems([
        { id: '1', name: 'Tee', price: '2500', quantity: 50, size: 'm', image: '/tee.jpg' },
        { id: '', name: 'Invalid', price: 100, quantity: 1, size: 'S' },
    ]), [{
        id: '1',
        name: 'Tee',
        price: 2500,
        quantity: 20,
        size: 'M',
        image: '/tee.jpg',
        color: undefined,
        isBundle: false,
    }]);
});

test('keeps different colors as separate cart lines', () => {
    const black = { id: '1', size: 'M', color: 'Black', isBundle: false };
    const red = { id: '1', size: 'M', color: 'Red', isBundle: false };

    assert.equal(sameCartLine(black, black), true);
    assert.equal(sameCartLine(black, red), false);
});

test('maps populated backend wishlist images to the storefront image', () => {
    assert.deepEqual(normalizeWishlistItem({
        _id: 'product-1',
        name: 'Product',
        price: 100,
        images: ['https://example.com/product.jpg'],
    }), {
        _id: 'product-1',
        id: 'product-1',
        name: 'Product',
        price: 100,
        image: 'https://example.com/product.jpg',
        images: ['https://example.com/product.jpg'],
    });
});

test('uses the first size that actually has stock', () => {
    assert.equal(getFirstAvailableSize({
        sizes: [
            { label: 'S', stock: 0 },
            { label: 'M', stock: 4 },
        ],
    }), 'M');
});

test('allows only internal post-login redirects', () => {
    assert.equal(getSafeRedirect('checkout'), '/checkout');
    assert.equal(getSafeRedirect('/account?tab=orders'), '/account?tab=orders');
    assert.equal(getSafeRedirect('//malicious.example'), '/');
    assert.equal(getSafeRedirect('https://malicious.example'), '/');
});

test('does not update cart state for an identical synchronized payload', () => {
    const cart = normalizeCartItems([
        { id: '1', name: 'Tee', price: 2500, quantity: 1, size: 'M', image: '/tee.jpg' },
    ]);
    assert.equal(cartsAreEqual(cart, structuredClone(cart)), true);
});
