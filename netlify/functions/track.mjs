// POST /api/track — registra un evento anonimo della landing offerte.
// Chiamato da offerte.js con navigator.sendBeacon, sempre (anche senza consenso).
import { getStore } from '@netlify/blobs';
import { buildKey, parseEvent } from '../lib/events.mjs';

export default async (req) => {
    if (req.method !== 'POST') return new Response(null, { status: 405 });
    const event = parseEvent(await req.text());
    if (!event) return new Response(null, { status: 400 });
    await getStore('offer-events').set(buildKey(event), '');
    return new Response(null, { status: 204 });
};

export const config = { path: '/api/track' };
