import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BadgePercent,
  Check,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  Package,
  Plus,
  RotateCcw,
  Save,
  Search,
  Settings2,
  Sparkles,
  Star,
  Store,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { benefitIconNames, BenefitIcon } from "@/components/store/BenefitsBar";
import {
  badgeLabel,
  defaultStoreData,
  formatPrice,
  hydrateStore,
  nextProductId,
  resetStoreData,
  setStoreData,
  sized,
  slugify,
  updateStoreData,
  useStore,
  type Badge,
  type BadgeTone,
  type Benefit,
  type Collection,
  type HeroSlide,
  type Product,
  type StoreData,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Painel Admin do GizmoHub" }] }),
  component: AdminPanel,
});

const CREDENTIALS = { user: "Admin", pass: "Admin577" };
const SESSION_KEY = "gizmoHubAdminSession";

type Tab = "dashboard" | "products" | "collections" | "hero" | "benefits" | "settings";

const tabs: Array<{ id: Tab; label: string; icon: typeof Package }> = [
  { id: "dashboard", label: "Painel", icon: LayoutGrid },
  { id: "products", label: "Produtos", icon: Package },
  { id: "collections", label: "Coleções", icon: LayoutGrid },
  { id: "hero", label: "Banner Hero", icon: ImageIcon },
  { id: "benefits", label: "Benefícios", icon: Sparkles },
  { id: "settings", label: "Configurações", icon: Settings2 },
];

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass = "mb-1.5 block text-xs font-semibold text-foreground";

function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
        checked ? "border-primary bg-primary-soft" : "border-border hover:border-primary/40"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
          checked ? "bg-primary" : "bg-muted-foreground/30"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 rounded-full bg-white transition-all ${
            checked ? "left-4.5" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Package;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <span className="grid size-10 place-items-center rounded-lg bg-primary-soft">
        <Icon className="size-5 text-primary" />
      </span>
      <p className="mt-3 text-2xl font-bold">{value}</p>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

/* ------------------------------- product form ------------------------------ */

function ProductForm({
  product,
  collections,
  onCancel,
  onSave,
}: {
  product: Product;
  collections: Collection[];
  onCancel: () => void;
  onSave: (product: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>(product);
  const set = <K extends keyof Product>(key: K, value: Product[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const galleryText = draft.gallery.join("\n");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const badge = draft.badge || undefined;
    const tone: BadgeTone | undefined =
      badge === "NEW"
        ? "new"
        : badge === "SALE"
          ? "sale"
          : badge === "BESTSELLER"
            ? "best"
            : undefined;
    onSave({
      ...draft,
      name: draft.name.trim() || "Novo produto",
      badge,
      tone,
      gallery: draft.gallery.filter(Boolean),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-primary/40 bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold">
          {product.id ? `Editando: ${product.name}` : "Novo produto"}
        </h3>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="Fechar">
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do produto">
          <input
            className={inputClass}
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="SoundPro X1"
          />
        </Field>
        <Field label="Categoria (rótulo)" hint="Ex.: Smartwatch, Wireless Earbuds">
          <input
            className={inputClass}
            value={draft.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Smartwatch"
          />
        </Field>
        <Field label="Coleção">
          <select
            className={inputClass}
            value={draft.collection}
            onChange={(e) => set("collection", e.target.value)}
          >
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Selo">
          <select
            className={inputClass}
            value={draft.badge ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              set("badge", (value === "" ? undefined : (value as Badge)) ?? undefined);
            }}
          >
            <option value="">Nenhum</option>
            <option value="NEW">{badgeLabel("NEW")}</option>
            <option value="SALE">{badgeLabel("SALE")}</option>
            <option value="BESTSELLER">{badgeLabel("BESTSELLER")}</option>
          </select>
        </Field>
        <Field label="Preço (R$)">
          <input
            className={inputClass}
            type="number"
            step="0.01"
            min="0"
            value={draft.price}
            onChange={(e) => set("price", Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Preço antigo (R$)" hint="Deixe 0 para não exibir">
          <input
            className={inputClass}
            type="number"
            step="0.01"
            min="0"
            value={draft.oldPrice ?? 0}
            onChange={(e) => {
              const value = Number(e.target.value) || 0;
              set("oldPrice", value > draft.price ? value : undefined);
            }}
          />
        </Field>
        <Field label="Estoque" className="md:col-span-1">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={draft.stock}
            onChange={(e) => set("stock", Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
        <Field label="Avaliação (0 a 5)">
          <input
            className={inputClass}
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={draft.rating}
            onChange={(e) => set("rating", Math.min(5, Math.max(0, Number(e.target.value) || 0)))}
          />
        </Field>
        <Field label="Nº de avaliações">
          <input
            className={inputClass}
            type="number"
            min="0"
            value={draft.reviews}
            onChange={(e) => set("reviews", Math.max(0, Number(e.target.value) || 0))}
          />
        </Field>
      </div>

      <Field label="Imagem principal (URL)">
        <input
          className={inputClass}
          value={draft.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="https://images.pexels.com/photos/..."
        />
      </Field>

      <Field label="Galeria" hint="Uma URL por linha — usada no quick view do produto">
        <textarea
          className={`${inputClass} min-h-[90px] font-mono text-xs`}
          value={galleryText}
          onChange={(e) =>
            set(
              "gallery",
              e.target.value
                .split(/\r?\n/)
                .map((line) => line.trim())
                .filter(Boolean),
            )
          }
        />
      </Field>

      <Field label="Descrição">
        <textarea
          className={`${inputClass} min-h-[90px]`}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Toggle
          label="Destaque (Top Picks)"
          checked={draft.featured}
          onChange={(v) => set("featured", v)}
        />
        <Toggle label="Ativo na loja" checked={draft.active} onChange={(v) => set("active", v)} />
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 overflow-x-auto">
          {(draft.gallery.length ? draft.gallery : [draft.image]).slice(0, 4).map((img, idx) => (
            <img
              key={`${img}-${idx}`}
              src={sized(img, 200, 200)}
              alt=""
              className="size-20 shrink-0 rounded-lg border border-border object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="submit">
          <Save className="size-4" /> Salvar produto
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}

/* --------------------------------- panel ----------------------------------- */

function AdminPanel() {
  const store = useStore();
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [saved, setSaved] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hydrateStore();
    if (typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1") {
      setLogged(true);
    }
  }, []);

  const flashSaved = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const save = (updater: (prev: StoreData) => StoreData) => {
    setStoreData(updater);
    flashSaved();
  };

  const login = (event: React.FormEvent) => {
    event.preventDefault();
    if (user === CREDENTIALS.user && pass === CREDENTIALS.pass) {
      setLogged(true);
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setError(null);
    } else {
      setError("Usuário ou senha inválidos.");
    }
  };

  const logout = () => {
    setLogged(false);
    window.sessionStorage.removeItem(SESSION_KEY);
  };

  /* ------------------------------ products ------------------------------- */
  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();
    return store.products.filter((product) => {
      const matchesTerm =
        !term ||
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);
      const matchesCollection =
        collectionFilter === "all" || product.collection === collectionFilter;
      return matchesTerm && matchesCollection;
    });
  }, [store.products, query, collectionFilter]);

  const upsertProduct = (product: Product) => {
    save((prev) => ({
      ...prev,
      products: prev.products.some((p) => p.id === product.id)
        ? prev.products.map((p) => (p.id === product.id ? product : p))
        : [...prev.products, product],
    }));
    setEditing(null);
    setCreating(false);
  };

  const blankProduct = (): Product => ({
    id: nextProductId(store),
    name: "",
    category: "Novo",
    collection: store.collections[0]?.id ?? "audio",
    price: 0,
    oldPrice: undefined,
    badge: undefined,
    tone: undefined,
    image: "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg",
    gallery: [],
    description: "",
    rating: 4.6,
    reviews: 120,
    stock: 20,
    featured: false,
    active: true,
  });

  const duplicateProduct = (product: Product) => {
    const copy: Product = { ...product, id: nextProductId(store), name: `${product.name} (cópia)` };
    save((prev) => ({ ...prev, products: [...prev.products, copy] }));
  };

  const removeProduct = (id: number) => {
    save((prev) => ({ ...prev, products: prev.products.filter((p) => p.id !== id) }));
  };

  const toggleProductFlag = (id: number, key: "featured" | "active") => {
    save((prev) => ({
      ...prev,
      products: prev.products.map((p) => (p.id === id ? { ...p, [key]: !p[key] } : p)),
    }));
  };

  /* ----------------------------- collections ----------------------------- */
  const upsertCollection = (collection: Collection) => {
    save((prev) => ({
      ...prev,
      collections: prev.collections.some((c) => c.id === collection.id)
        ? prev.collections.map((c) => (c.id === collection.id ? collection : c))
        : [...prev.collections, collection],
    }));
  };

  const removeCollection = (id: string) => {
    if (store.collections.length <= 1) return;
    const fallback = store.collections.find((c) => c.id !== id)?.id ?? "audio";
    save((prev) => ({
      ...prev,
      collections: prev.collections.filter((c) => c.id !== id),
      products: prev.products.map((p) =>
        p.collection === id ? { ...p, collection: fallback } : p,
      ),
    }));
  };

  /* -------------------------------- hero --------------------------------- */
  const upsertSlide = (slide: HeroSlide) => {
    save((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.some((s) => s.id === slide.id)
        ? prev.heroSlides.map((s) => (s.id === slide.id ? slide : s))
        : [...prev.heroSlides, slide],
    }));
  };

  const moveSlide = (index: number, direction: -1 | 1) => {
    save((prev) => {
      const slides = [...prev.heroSlides];
      const target = index + direction;
      if (target < 0 || target >= slides.length) return prev;
      const current = slides[index];
      const other = slides[target];
      if (!current || !other) return prev;
      slides[index] = other;
      slides[target] = current;
      return { ...prev, heroSlides: slides };
    });
  };

  /* ------------------------------- benefits ------------------------------ */
  const upsertBenefit = (benefit: Benefit) => {
    save((prev) => ({
      ...prev,
      benefits: prev.benefits.some((b) => b.id === benefit.id)
        ? prev.benefits.map((b) => (b.id === benefit.id ? benefit : b))
        : [...prev.benefits, benefit],
    }));
  };

  /* -------------------------------- renders ------------------------------ */

  if (!logged) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-dark to-brand-surface p-4">
        <div className="w-full max-w-md rounded-xl bg-card p-8 shadow-drawer">
          <div className="mb-8 flex items-center justify-center gap-2.5 text-2xl font-bold">
            <span className="grid size-10 place-items-center rounded-lg bg-primary">
              <Store className="size-5 text-primary-foreground" />
            </span>
            GizmoHub Admin
          </div>
          <form onSubmit={login} className="space-y-4">
            <Field label="Usuário">
              <input
                className={inputClass}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Admin"
                autoComplete="username"
              />
            </Field>
            <Field label="Senha">
              <input
                className={inputClass}
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </Field>
            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">Demo: Admin / Admin577</p>
          <Link
            to="/"
            className="mt-3 flex items-center justify-center gap-1 text-xs font-semibold text-primary"
          >
            <ArrowLeft className="size-3" /> Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }

  const lowStock = store.products.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const avgPrice =
    store.products.length > 0
      ? store.products.reduce((sum, p) => sum + p.price, 0) / store.products.length
      : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-brand-dark text-brand-light shadow-header">
        <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-3.5 lg:px-10">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary">
              <Store className="size-5 text-primary-foreground" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-base font-bold">{store.settings.storeName} Admin</p>
              <p className="truncate text-xs text-brand-muted">
                WhatsApp {store.settings.whatsappNumber}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {saved ? (
              <span className="hidden items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground sm:flex">
                <Check className="size-3.5" /> Salvo
              </span>
            ) : null}
            <Link to="/" target="_blank">
              <Button variant="outline" size="sm">
                <Eye className="size-4" /> Ver loja
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="size-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-page px-5 py-6 lg:px-10">
        {/* Tabs */}
        <div className="no-scrollbar -mx-5 mb-6 flex gap-2 overflow-x-auto border-b border-border px-5 pb-0 lg:mx-0 lg:px-0">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "border-b-2 border-primary text-primary"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="size-4" /> {item.label}
            </button>
          ))}
        </div>

        {/* ------------------------------ dashboard ------------------------------ */}
        {tab === "dashboard" ? (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Package}
                label="Produtos no catálogo"
                value={store.products.length}
                hint={`${store.products.filter((p) => p.active).length} ativos`}
              />
              <StatCard
                icon={LayoutGrid}
                label="Coleções"
                value={store.collections.length}
                hint="Categorias navegáveis"
              />
              <StatCard icon={ImageIcon} label="Slides do hero" value={store.heroSlides.length} />
              <StatCard
                icon={BadgePercent}
                label="Preço médio"
                value={formatPrice(avgPrice)}
                hint={`${lowStock} com estoque baixo`}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-bold">Produtos por coleção</h3>
                <ul className="mt-4 space-y-3">
                  {store.collections.map((collection) => {
                    const count = store.products.filter(
                      (p) => p.collection === collection.id,
                    ).length;
                    const percent = store.products.length
                      ? Math.round((count / store.products.length) * 100)
                      : 0;
                    return (
                      <li key={collection.id}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{collection.name}</span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="text-base font-bold">Backup e manutenção</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Exporte seu catálogo, importe em outra loja ou restaure os dados originais.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const blob = new Blob([JSON.stringify(store, null, 2)], {
                        type: "application/json",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "gizmohub-store.json";
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="size-4" /> Exportar JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}>
                    <Upload className="size-4" /> Importar JSON
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (window.confirm("Restaurar o catálogo original do GizmoHub?")) {
                        resetStoreData();
                        flashSaved();
                      }
                    }}
                  >
                    <RotateCcw className="size-4" /> Restaurar padrões
                  </Button>
                  <input
                    ref={importRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      try {
                        const text = await file.text();
                        setStoreData(JSON.parse(text) as StoreData);
                        flashSaved();
                      } catch {
                        window.alert("Arquivo inválido.");
                      }
                    }}
                  />
                </div>

                <div className="mt-5 rounded-lg bg-primary-soft p-4 text-sm">
                  <p className="font-semibold">Checkout via WhatsApp</p>
                  <p className="mt-1 text-muted-foreground">
                    Pedidos são enviados para{" "}
                    <strong className="text-foreground">+{store.settings.whatsappNumber}</strong>{" "}
                    com nome, endereço, forma de pagamento e total. Altere o número em
                    Configurações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {/* ------------------------------- products ------------------------------ */}
        {tab === "products" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Produtos</h2>
                <p className="text-sm text-muted-foreground">
                  {store.products.length} produtos • edite preços, imagens, coleções e colunas de
                  destaque.
                </p>
              </div>
              <Button
                onClick={() => {
                  setEditing(blankProduct());
                  setCreating(true);
                }}
              >
                <Plus className="size-4" /> Novo produto
              </Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <input
                  className={`${inputClass} pl-9`}
                  placeholder="Buscar por nome ou categoria..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <select
                className={`${inputClass} w-auto min-w-[180px]`}
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
              >
                <option value="all">Todas as coleções</option>
                {store.collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>

            {editing ? (
              <ProductForm
                key={editing.id}
                product={editing}
                collections={store.collections}
                onCancel={() => {
                  setEditing(null);
                  setCreating(false);
                }}
                onSave={upsertProduct}
              />
            ) : null}

            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="hidden grid-cols-[64px_1fr_150px_110px_90px_120px] gap-3 border-b border-border bg-muted/40 px-4 py-3 text-xs font-bold uppercase tracking-wide text-muted-foreground lg:grid">
                <span>Foto</span>
                <span>Produto</span>
                <span>Coleção</span>
                <span>Preço</span>
                <span>Status</span>
                <span className="text-right">Ações</span>
              </div>
              <div className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="grid grid-cols-[64px_1fr] items-center gap-3 p-3 lg:grid-cols-[64px_1fr_150px_110px_90px_120px] lg:px-4"
                  >
                    <img
                      src={sized(product.image, 200, 200)}
                      alt={product.name}
                      className="size-14 rounded-lg border border-border object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.category} • estoque {product.stock} • ★ {product.rating.toFixed(1)}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {product.badge ? (
                          <span className="rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                            {badgeLabel(product.badge)}
                          </span>
                        ) : null}
                        {product.featured ? (
                          <span className="inline-flex items-center gap-1 rounded bg-primary-soft px-1.5 py-0.5 text-[10px] font-bold text-primary">
                            <Star className="size-3" /> Destaque
                          </span>
                        ) : null}
                        <span className="lg:hidden">
                          {store.collections.find((c) => c.id === product.collection)?.name ?? "—"}
                        </span>
                        <span className="font-bold lg:hidden">
                          {formatPrice(product.price)}
                          {product.oldPrice ? (
                            <span className="ml-1 text-xs font-medium text-muted-foreground line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          ) : null}
                        </span>
                      </div>
                    </div>
                    <span className="hidden text-sm text-muted-foreground lg:block">
                      {store.collections.find((c) => c.id === product.collection)?.name ?? "—"}
                    </span>
                    <span className="hidden text-sm font-bold lg:block">
                      {formatPrice(product.price)}
                      {product.oldPrice ? (
                        <span className="ml-1 text-xs font-medium text-muted-foreground line-through">
                          {formatPrice(product.oldPrice)}
                        </span>
                      ) : null}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleProductFlag(product.id, "active")}
                      className={`flex w-fit items-center gap-1 rounded-full px-2 py-1 text-[11px] font-bold ${
                        product.active
                          ? "bg-primary-soft text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {product.active ? (
                        <>
                          <Eye className="size-3" /> Ativo
                        </>
                      ) : (
                        <>
                          <EyeOff className="size-3" /> Inativo
                        </>
                      )}
                    </button>
                    <div className="col-span-2 flex justify-end gap-1 lg:col-span-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Destaque"
                        onClick={() => toggleProductFlag(product.id, "featured")}
                        className={product.featured ? "text-primary" : ""}
                      >
                        <Star
                          className="size-4"
                          fill={product.featured ? "currentColor" : "none"}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Duplicar"
                        onClick={() => duplicateProduct(product)}
                      >
                        <Copy className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() => {
                          setCreating(false);
                          setEditing(product);
                        }}
                      >
                        <Settings2 className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Excluir"
                        onClick={() => {
                          if (window.confirm(`Excluir "${product.name}"?`))
                            removeProduct(product.id);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 ? (
                  <p className="p-8 text-center text-sm text-muted-foreground">
                    Nenhum produto encontrado.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* ----------------------------- collections ----------------------------- */}
        {tab === "collections" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Coleções (colunas da loja)</h2>
                <p className="text-sm text-muted-foreground">
                  Cada coleção vira uma coluna clicável que filtra o catálogo com vários produtos.
                </p>
              </div>
              <Button
                onClick={() =>
                  upsertCollection({
                    id:
                      slugify(`colecao-${store.collections.length + 1}`) ||
                      `collection-${Date.now()}`,
                    name: "Nova coleção",
                    image: "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg",
                    tagline: "Descreva a coleção",
                  })
                }
              >
                <Plus className="size-4" /> Nova coleção
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {store.collections.map((collection) => (
                <div
                  key={collection.id}
                  className="overflow-hidden rounded-xl border border-border bg-card"
                >
                  <img
                    src={sized(collection.image, 600, 400)}
                    alt={collection.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="space-y-3 p-4">
                    <Field label="Nome">
                      <input
                        className={inputClass}
                        value={collection.name}
                        onChange={(e) =>
                          upsertCollection({
                            ...collection,
                            name: e.target.value,
                            id: collection.id.startsWith("collection-")
                              ? slugify(e.target.value) || collection.id
                              : collection.id,
                          })
                        }
                      />
                    </Field>
                    <Field label="Legenda">
                      <input
                        className={inputClass}
                        value={collection.tagline}
                        onChange={(e) =>
                          upsertCollection({ ...collection, tagline: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Imagem (URL)">
                      <input
                        className={inputClass}
                        value={collection.image}
                        onChange={(e) => upsertCollection({ ...collection, image: e.target.value })}
                      />
                    </Field>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-muted-foreground">
                        {store.products.filter((p) => p.collection === collection.id).length}{" "}
                        produtos
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        disabled={store.collections.length <= 1}
                        onClick={() => {
                          if (window.confirm(`Excluir a coleção "${collection.name}"?`))
                            removeCollection(collection.id);
                        }}
                      >
                        <Trash2 className="size-4" /> Excluir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* --------------------------------- hero -------------------------------- */}
        {tab === "hero" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Banner Hero</h2>
                <p className="text-sm text-muted-foreground">
                  Slides com fade automático. Use as setas para reordenar.
                </p>
              </div>
              <Button
                onClick={() =>
                  upsertSlide({
                    id: `hero-${Date.now()}`,
                    image: "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg",
                    eyebrow: "Novo destaque",
                    title: "Título do slide",
                    subtitle: "Descreva a oferta em uma frase curta.",
                    ctaLabel: "Comprar agora",
                    ctaTarget: "catalog",
                  })
                }
              >
                <Plus className="size-4" /> Novo slide
              </Button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {store.heroSlides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="space-y-3 rounded-xl border border-border bg-card p-4"
                >
                  <img
                    src={sized(slide.image, 600, 400)}
                    alt={slide.title}
                    className="h-36 w-full rounded-lg object-cover"
                  />
                  <Field label="Imagem (URL)">
                    <input
                      className={inputClass}
                      value={slide.image}
                      onChange={(e) => upsertSlide({ ...slide, image: e.target.value })}
                    />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Sobretítulo">
                      <input
                        className={inputClass}
                        value={slide.eyebrow}
                        onChange={(e) => upsertSlide({ ...slide, eyebrow: e.target.value })}
                      />
                    </Field>
                    <Field label="Botão">
                      <input
                        className={inputClass}
                        value={slide.ctaLabel}
                        onChange={(e) => upsertSlide({ ...slide, ctaLabel: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field label="Título" hint="Use \n para quebrar linha">
                    <input
                      className={inputClass}
                      value={slide.title}
                      onChange={(e) => upsertSlide({ ...slide, title: e.target.value })}
                    />
                  </Field>
                  <Field label="Subtítulo">
                    <textarea
                      className={`${inputClass} min-h-[70px]`}
                      value={slide.subtitle}
                      onChange={(e) => upsertSlide({ ...slide, subtitle: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(index, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="size-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSlide(index, 1)}
                        disabled={index === store.heroSlides.length - 1}
                      >
                        <ArrowDown className="size-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => {
                        if (window.confirm("Excluir este slide?"))
                          save((prev) => ({
                            ...prev,
                            heroSlides: prev.heroSlides.filter((s) => s.id !== slide.id),
                          }));
                      }}
                    >
                      <Trash2 className="size-4" /> Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ------------------------------- benefits ------------------------------ */}
        {tab === "benefits" ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold">Barra de benefícios</h2>
                <p className="text-sm text-muted-foreground">
                  No mobile eles aparecem 2 por linha (2 em cima, 2 embaixo) e em 4 colunas no
                  desktop.
                </p>
              </div>
              <Button
                onClick={() =>
                  upsertBenefit({
                    id: `benefit-${Date.now()}`,
                    icon: "star",
                    title: "Novo benefício",
                    copy: "Descreva o benefício",
                  })
                }
              >
                <Plus className="size-4" /> Novo benefício
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {store.benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="space-y-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Título">
                      <input
                        className={inputClass}
                        value={benefit.title}
                        onChange={(e) => upsertBenefit({ ...benefit, title: e.target.value })}
                      />
                    </Field>
                    <Field label="Ícone">
                      <select
                        className={inputClass}
                        value={benefit.icon}
                        onChange={(e) => upsertBenefit({ ...benefit, icon: e.target.value })}
                      >
                        {benefitIconNames.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>
                  <Field label="Texto">
                    <input
                      className={inputClass}
                      value={benefit.copy}
                      onChange={(e) => upsertBenefit({ ...benefit, copy: e.target.value })}
                    />
                  </Field>
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BenefitIcon name={benefit.icon} className="size-4 text-primary" />
                      {benefit.title}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() =>
                        save((prev) => ({
                          ...prev,
                          benefits: prev.benefits.filter((b) => b.id !== benefit.id),
                        }))
                      }
                    >
                      <Trash2 className="size-4" /> Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ------------------------------- settings ------------------------------ */}
        {tab === "settings" ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-bold">Loja e checkout</h3>
              <Field label="Nome da loja">
                <input
                  className={inputClass}
                  value={store.settings.storeName}
                  onChange={(e) =>
                    updateStoreData({
                      settings: { ...store.settings, storeName: e.target.value },
                    })
                  }
                />
              </Field>
              <Field
                label="WhatsApp para receber pedidos"
                hint="Somente números, com DDD e DDI (55)"
              >
                <input
                  className={inputClass}
                  value={store.settings.whatsappNumber}
                  onChange={(e) =>
                    updateStoreData({
                      settings: {
                        ...store.settings,
                        whatsappNumber: e.target.value.replace(/\D/g, ""),
                      },
                    })
                  }
                  placeholder="5511977888609"
                />
              </Field>
              <Field label="E-mail de suporte">
                <input
                  className={inputClass}
                  value={store.settings.supportEmail}
                  onChange={(e) =>
                    updateStoreData({
                      settings: { ...store.settings, supportEmail: e.target.value },
                    })
                  }
                />
              </Field>
              <Toggle
                label="Mostrar barra de aviso"
                checked={store.settings.showAnnouncement}
                onChange={(value) =>
                  updateStoreData({
                    settings: { ...store.settings, showAnnouncement: value },
                  })
                }
              />
              <Field label="Texto do aviso">
                <input
                  className={inputClass}
                  value={store.settings.announcement}
                  onChange={(e) =>
                    updateStoreData({
                      settings: { ...store.settings, announcement: e.target.value },
                    })
                  }
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-bold">Layout e colunas</h3>
              <Field label="Produtos por linha (desktop)">
                <select
                  className={inputClass}
                  value={store.settings.productColumns}
                  onChange={(e) =>
                    updateStoreData({
                      settings: { ...store.settings, productColumns: Number(e.target.value) },
                    })
                  }
                >
                  {[2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} colunas
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Coleções por linha (desktop)">
                <select
                  className={inputClass}
                  value={store.settings.collectionColumns}
                  onChange={(e) =>
                    updateStoreData({
                      settings: { ...store.settings, collectionColumns: Number(e.target.value) },
                    })
                  }
                >
                  {[2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} colunas
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tempo de cada slide do hero (ms)">
                <input
                  className={inputClass}
                  type="number"
                  min="1500"
                  step="500"
                  value={store.settings.heroAutoplayMs}
                  onChange={(e) =>
                    updateStoreData({
                      settings: {
                        ...store.settings,
                        heroAutoplayMs: Math.max(1500, Number(e.target.value) || 5000),
                      },
                    })
                  }
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h3 className="text-base font-bold">Frete e pagamento</h3>
              <Field label="Frete grátis a partir de (R$)">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  step="1"
                  value={store.settings.freeShippingFrom}
                  onChange={(e) =>
                    updateStoreData({
                      settings: {
                        ...store.settings,
                        freeShippingFrom: Math.max(0, Number(e.target.value) || 0),
                      },
                    })
                  }
                />
              </Field>
              <Field label="Desconto no Pix (%)">
                <input
                  className={inputClass}
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={store.settings.pixDiscountPercent}
                  onChange={(e) =>
                    updateStoreData({
                      settings: {
                        ...store.settings,
                        pixDiscountPercent: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                      },
                    })
                  }
                />
              </Field>
              <Field label="Parcelamento máximo no cartão">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  max="24"
                  step="1"
                  value={store.settings.maxInstallments}
                  onChange={(e) =>
                    updateStoreData({
                      settings: {
                        ...store.settings,
                        maxInstallments: Math.min(24, Math.max(1, Number(e.target.value) || 1)),
                      },
                    })
                  }
                />
              </Field>
            </div>

            <div className="space-y-4 rounded-xl border border-border bg-card p-5">
              <h3 className="flex items-center gap-2 text-base font-bold">
                <Database className="size-4 text-primary" /> Dados padrão
              </h3>
              <p className="text-sm text-muted-foreground">
                O catálogo original do GizmoHub (SoundPro X1, Active Watch 2, BoomMate, GameMax Pro
                e as 4 coleções) continua disponível e pode ser restaurado a qualquer momento.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  if (window.confirm("Restaurar todos os dados originais?")) {
                    resetStoreData();
                    flashSaved();
                  }
                }}
              >
                <RotateCcw className="size-4" /> Restaurar dados originais
              </Button>
              <p className="text-xs text-muted-foreground">
                Produtos padrão: {defaultStoreData.products.length} • Coleções padrão:{" "}
                {defaultStoreData.collections.length} • Slides padrão:{" "}
                {defaultStoreData.heroSlides.length}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default AdminPanel;
