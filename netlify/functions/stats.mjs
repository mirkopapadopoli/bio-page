// GET /api/stats?key=<STATS_KEY>&from=YYYY-MM-DD&to=YYYY-MM-DD
// Conteggi aggregati del contatore anonimo, per ad e per negozio.
// STATS_KEY va impostata nelle variabili d'ambiente del sito Netlify.
import { getStore } from '@netlify/blobs';
import { aggregate, daysBetween } from '../lib/events.mjs';

export default async (req) => {
    const url = new URL(req.url);
    const expected = Netlify.env.get('STATS_KEY');
    if (!expected || url.searchParams.get('key') !== expected) {
        return new Response(null, { status: 404 });
    }

    const today = new Date().toISOString().slice(0, 10);
    const days = daysBetween(url.searchParams.get('from') || today, url.searchParams.get('to') || today);
    const store = getStore('offer-events');
    const keys = [];
    for (const day of days) {
        for await (const page of store.list({ prefix: day + '/', paginate: true })) {
            keys.push(...page.blobs.map(b => b.key));
        }
    }

    const body = { from: days[0] || null, to: days.at(-1) || null, events: keys.length, ...aggregate(keys) };
    return Response.json(body, { headers: { 'Cache-Control': 'no-store' } });
};

export const config = { path: '/api/stats' };
