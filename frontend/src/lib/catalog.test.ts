import assert from 'node:assert/strict';
import test from 'node:test';
import { COLLECTION_NAV_LINKS, PRODUCT_CATEGORIES } from './catalog.ts';

test('collection navigation includes Shop All and every supported product category', () => {
    assert.equal(COLLECTION_NAV_LINKS[0].href, '/shop');

    for (const category of PRODUCT_CATEGORIES) {
        assert.ok(
            COLLECTION_NAV_LINKS.some((link) => (
                link.name === category
                && link.href === `/shop?category=${encodeURIComponent(category)}`
            )),
            `missing collection link for ${category}`
        );
    }
});
