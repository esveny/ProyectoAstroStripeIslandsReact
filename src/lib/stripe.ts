// src/lib/stripe.ts
export type CheckoutItem = {
  sku: string;
  name: string;
  unit_amount: number; // en centavos
  qty: number;
  image: string;
};

export async function createCheckoutSession(items: CheckoutItem[]): Promise<{ url: string } | { error: string }> {
  if (!items?.length) return { error: "Carrito vacío." };

  try {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const raw = await res.text();
    let data: any;
    try { data = JSON.parse(raw); } catch { return { error: `Respuesta no válida del servidor: ${raw}` }; }

    if (!res.ok) return { error: data?.error ?? "Error en checkout." };
    if (!data?.url) return { error: "La API no devolvió la URL de Checkout." };

    return { url: data.url };
  } catch (e: any) {
    return { error: e?.message ?? "Fallo de red al crear la sesión de pago." };
  }
}
