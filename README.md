# Mobile Marvel

Quero que use esse repositório ja existente, com o projeto ja existente (index)



https://github.com/msmacrosmart-cpu/gizmo-hub



A pagina já está perfeita no modo desktop, porem o arena.ai não soube criar no modo mobile também, quero que estude o funcionamento do desktop e crie a pagina mobile sem criar ou mudar o projeto, mantendo tudo onde deve estar



2 quero também que os menus sejam todos funcionais, seguindo exatamente o mesmo estilo do layout atual.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://gizmo-hub-blue.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d474f64b-7a62-4294-bce2-2c73bfe20e21).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

---

## How the store works (2026 update)

**Storefront (`/`)** — single page with section navigation:

| Section | What it does |
| --- | --- |
| Announcement + header | Free-shipping bar, working nav (Home, Shop, New Arrivals, Top Deals, Brands, Blog, Contact), search, wishlist, account and cart |
| Hero | 5 auto-playing slides with **fade** transition, arrows and dots (3 original images + 2 extra electronics) |
| Benefits bar | 4 trust badges — **2 per row on mobile** (2 on top, 2 on the bottom), 4 columns on desktop |
| Shop by category | 5 collections; clicking one filters the catalog and shows every product of that type (e.g. Smart Watches → 7 models) |
| Top Picks | Featured products (horizontal snap carousel on mobile) |
| Deals / New Arrivals / Best Sellers | Promo blocks that filter the catalog |
| Catalog | 34 priced products, collection/New/Sale/Bestseller chips, sorting, quick view with image gallery |
| Brands, Blog, Newsletter, Footer | Content sections + WhatsApp contact |

**Cart** — add, change quantity with +/-, remove a single item, clear the cart, live
subtotal, free-shipping progress bar and a sticky mobile cart bar. The cart is saved in
`localStorage`, so it survives a reload.

**Checkout** — the Checkout button opens a form that collects:

- name, WhatsApp and e-mail
- delivery address (CEP with auto-fill, street, number, complement, neighborhood, city, state, reference)
- payment method: **Pix** (with the configured discount) or **credit card** (installments)
- order notes

On submit the order is formatted with emojis (customer, address, payment, itemised
products and the **total at the end**) and sent to **wa.me/5511977888609**.

**Admin (`/admin`)** — login `Admin` / `Admin577`, then:

- **Painel** — stats, products per collection, JSON export/import and restore defaults
- **Produtos** — create/edit/duplicate/delete, price, old price, badge, collection, gallery,
  stock, rating, featured and active flags, search + collection filter
- **Coleções** — create/edit/delete the store columns; each one filters the catalog
- **Banner Hero** — add/edit/reorder/delete slides (image, title, subtitle, CTA)
- **Benefícios** — edit the 4 trust badges (title, text, icon)
- **Configurações** — store name, WhatsApp number, announcement bar, free-shipping
  threshold, Pix discount, max installments, hero timing and how many
  **columns** are used for products and collections

Everything is stored under the `gizmoHubStore.v1` localStorage key and shared live
between the storefront and the admin. All the original GizmoHub content (SoundPro X1,
Active Watch 2, BoomMate, GameMax Pro, the 4 collections, the 3 hero images and every
original section) is preserved and can be restored from **Configurações → Restaurar dados originais**.

## Development

```sh
npm install
npm run dev     # http://localhost:8080
npm run build
npm run lint
```
