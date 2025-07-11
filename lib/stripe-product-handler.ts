import Stripe from "stripe"
import type { Artifact } from "./howlin-csv-parser"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_SECRET_KEY) {
  console.error("Stripe secret key is not set in environment variables.")
  // Potentially throw an error or handle this state appropriately
}

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20", // Use the latest API version
    })
  : null

const CURRENCY = "eur"

export async function createStripeProductAndPrice(artifact: Artifact): Promise<Artifact> {
  if (!stripe) {
    console.error("Stripe client not initialized. Cannot create product.")
    return { ...artifact, active: false, product_id: null, price_id: null }
  }

  try {
    // Step 1: Create Product
    const product = await stripe.products.create({
      name: `${artifact.artist} – ${artifact.title}`,
      description: `${artifact.format} release. Genre: ${artifact.keywords.join(", ")}. Category: ${artifact.category}.`,
      metadata: {
        slug: artifact.slug,
        format: artifact.format,
        category: artifact.category,
        artist: artifact.artist,
        title: artifact.title,
        discogs_url: artifact.discogs_url || "",
      },
    })

    // Step 2: Create Price
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(artifact.price * 100), // Convert to cents and ensure integer
      currency: CURRENCY,
    })

    return {
      ...artifact,
      product_id: product.id,
      price_id: price.id,
      active: true,
    }
  } catch (error: any) {
    console.error(`Stripe API Error for [${artifact.artist} – ${artifact.title}]: ${error.message}`)
    // Log more details if needed: console.error(error);
    return { ...artifact, active: false, product_id: null, price_id: null } // Return original artifact with active: false
  }
}
