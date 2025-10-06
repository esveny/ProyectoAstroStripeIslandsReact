// src/pages/api/checkout.ts
export const prerender = false;

import Stripe from "stripe";
import type { APIRoute } from "astro";
import { z } from "zod";
import { getAllProducts } from "../../lib/products";

const Item = z.object({
  sku: z.string(),
  name: z.string(),
  unit_amount: z.number().int().positive(), // centavos
  qty: z.number().int().positive(),
  image: z.string().url(),
});
const Payload = z.object({ items: z.array(Item).min(1) });

export const POST: APIRoute = async ({ request, url }) => {
  const secret = import.meta.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return new Response(JSON.stringify({ error: "Stripe no está configurado." }), { status: 400 });
  }

  const stripe = new Stripe(secret);

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Cuerpo JSON inválido o vacío." }), { status: 400 });
  }

  let items: any[];
  try {
    ({ items } = Payload.parse(json));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Payload inválido.", details: e?.errors ?? String(e) }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const catalog = getAllProducts();
  const line_items = items.map((it) => {
    const p = catalog.find((x) => x.sku === it.sku);
    if (!p || Math.round(p.price * 100) !== it.unit_amount) {
      throw new Error(`Precio/SKU inválido: ${it.sku}`);
    }
    return {
      price_data: {
        currency: "usd",
        product_data: { name: p.name, images: [it.image] }, // puedes omitir images si estás en local
        unit_amount: it.unit_amount,
      },
      quantity: it.qty,
    };
  });

  const origin = url.origin;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items,
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cancel`,
  });

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
