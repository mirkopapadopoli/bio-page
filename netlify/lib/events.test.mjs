import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aggregate, buildKey, clean, daysBetween, parseEvent, parseKey } from './events.mjs';

const NOW = new Date('2026-10-30T09:15:00Z');

test('parseEvent accetta solo eventi noti e pulisce i campi', () => {
    const ev = parseEvent(JSON.stringify({
        e: 'click_offer', src: 'ads', utm_content: 'prima-dopo', brand: 'H&M / Italia', extra: 'x'
    }));
    assert.deepEqual(ev, { e: 'click_offer', src: 'ads', utm_campaign: '', utm_content: 'prima-dopo', brand: 'H&M  Italia' });
    assert.equal(parseEvent(JSON.stringify({ e: 'purchase' })), null);
    assert.equal(parseEvent('non json'), null);
    assert.equal(parseEvent('x'.repeat(2000)), null);
});

test('clean tronca e scarta i tipi non stringa', () => {
    assert.equal(clean('a'.repeat(100)).length, 60);
    assert.equal(clean(42), '');
    assert.equal(clean('<script>'), 'script');
});

test('buildKey e parseKey fanno andata e ritorno', () => {
    const ev = { e: 'copy_code', src: 'ads', utm_campaign: 'test-ott26', utm_content: 'nota', brand: "L'Oréal" };
    const key = buildKey(ev, NOW, 0.123456);
    assert.ok(key.startsWith('2026-10-30/copy_code/ads/'));
    assert.deepEqual(parseKey(key), { day: '2026-10-30', ...ev });
});

test('campi vuoti diventano "-" nella chiave e tornano vuoti', () => {
    const key = buildKey({ e: 'page_view', src: 'organic', utm_campaign: '', utm_content: '', brand: '' }, NOW, 0.5);
    assert.equal(parseKey(key).utm_content, '');
});

test('aggregate conta per ad e i click per negozio', () => {
    const mk = (e, utm_content, brand = '') => buildKey({ e, src: 'ads', utm_campaign: 'c', utm_content, brand }, NOW, Math.random());
    const out = aggregate([
        mk('page_view', 'prima-dopo'), mk('page_view', 'prima-dopo'), mk('click_offer', 'prima-dopo', 'Zalando'),
        mk('page_view', 'nota'), mk('click_offer', 'nota', 'Zalando'), mk('click_offer', 'nota', 'Pinko'),
        'chiave/rotta'
    ]);
    assert.equal(out.by_ad[0].utm_content, 'prima-dopo');
    assert.equal(out.by_ad[0].page_view, 2);
    assert.equal(out.by_ad[0].click_offer, 1);
    assert.equal(out.by_ad[1].click_offer, 2);
    assert.deepEqual(out.click_offer_by_brand, { Zalando: 2, Pinko: 1 });
});

test('daysBetween include gli estremi e rifiuta date non valide', () => {
    assert.deepEqual(daysBetween('2026-10-30', '2026-11-01'), ['2026-10-30', '2026-10-31', '2026-11-01']);
    assert.deepEqual(daysBetween('ieri', '2026-11-01'), []);
    assert.equal(daysBetween('2026-01-01', '2026-12-31').length, 92);
});
