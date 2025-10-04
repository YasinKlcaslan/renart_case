## Renart Product Showcase

Modern product listing experience built with Next.js 15. The app exposes a REST API that enriches product data with live gold prices and renders an interactive carousel with color selection, swipe gestures, and responsiveness that mirrors the provided design brief.

---

## ✨ Features

- **Dynamic pricing API** powered by real-time gold price data (`https://data-asg.goldprice.org/dbXRates/USD`).
- **Optional backend filters** for price and popularity to support future product discovery UIs.
- **Interactive product carousel** with keyboard/arrow controls, swipe gestures (desktop + mobile), and active slide indicators.
- **Color picker** swaps between the three metal options for every product image.
- **Popularity meter** converts the raw popularity score into a 5-point scale with one decimal place.
- **Lint-ready codebase** with ESLint to catch issues early.

---

## 🗂️ Project Structure

- `src/app/api/products/route.js` – REST endpoint that enriches product data.
- `src/lib/products.js` – Pure helpers for price calculations and filtering.
- `src/app/page.js` – Client-side carousel implementation.
- `src/app/data/products.json` – Static catalogue consumed by the API.

---

## API Reference

### `GET /api/products`

Returns the product list enriched with pricing and metadata.

#### Query Parameters

| Parameter        | Type   | Description                                     |
|------------------|--------|-------------------------------------------------|
| `minPrice`       | number | Minimum price in USD                            |
| `maxPrice`       | number | Maximum price in USD                            |
| `minPopularity`  | number | Minimum popularity (0–5 scale)                  |
| `maxPopularity`  | number | Maximum popularity (0–5 scale)                  |

#### Response Shape

```json
{
	"data": [
		{
			"name": "Engagement Ring 1",
			"popularityScore": 0.85,
			"weight": 2.1,
			"images": { "yellow": "…", "rose": "…", "white": "…" },
			"colors": ["yellow", "rose", "white"],
			"priceUSD": 469.52,
			"popularityOutOfFive": 4.3
		}
	],
	"meta": {
		"total": 8,
		"count": 8,
		"goldPricePerGram": 68.45,
		"filters": {}
	}
}