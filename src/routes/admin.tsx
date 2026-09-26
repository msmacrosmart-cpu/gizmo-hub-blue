import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "GizmoHub Admin Panel" }] }),
  component: AdminPanel,
});

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  oldPrice?: string;
  badge?: string;
  tone?: "new" | "best" | "sale";
  image: string;
}

interface Category {
  name: string;
  image: string;
}

function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"hero" | "products" | "categories">("products");

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingHeroIdx, setEditingHeroIdx] = useState<number | null>(null);
  const [tempHeroImage, setTempHeroImage] = useState<string>("");
  const [editingCategoryIdx, setEditingCategoryIdx] = useState<number | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("gizmoHubData");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setHeroImages(data.heroImages || []);
        setProducts(data.products || []);
        setCategories(data.categories || []);
      } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
      }
    }
  }, []);

  // Correção: Salvando a chave como 'products' em vez de 'customProducts'
  const saveData = (newHero: string[], newProducts: Product[], newCategories: Category[]) => {
    localStorage.setItem(
      "gizmoHubData",
      JSON.stringify({
        heroImages: newHero,
        products: newProducts,
        categories: newCategories,
      })
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Admin" && password === "Admin577") {
      setIsLoggedIn(true);
      setUsername("");
      setPassword("");
    } else {
      alert("Credenciais inválidas");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-dark to-brand-surface flex items-center justify-center p-4">
        <div className="bg-card rounded-xl shadow-drawer p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-foreground mb-8 text-center">GizmoHub Admin</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-border rounded-lg bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-border rounded-lg bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full">Entrar</Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">Demo: Admin / Admin577</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-brand-dark text-brand-light shadow-header">
        <div className="mx-auto max-w-page px-5 py-4 lg:px-10 flex items-center justify-between">
          <h1 className="text-2xl font-bold">GizmoHub Admin</h1>
          <Button variant="outline" onClick={() => setIsLoggedIn(false)} className="text-brand-light border-brand-light">Sair</Button>
        </div>
      </header>

      <main className="mx-auto max-w-page px-5 py-8 lg:px-10">
        <div className="flex gap-2 mb-8 border-b border-border">
          {["products", "hero", "categories"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === tab ? "text-primary border-b-2 border-primary -mb-1" : "text-muted-foreground hover:text-foreground"}`}
            >
              {tab === "products" && "Produtos"}
              {tab === "hero" && "Banner Hero"}
              {tab === "categories" && "Categorias"}
            </button>
          ))}
        </div>

        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
              <Button
                onClick={() => {
                  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
                  const newProduct: Product = {
                    id: newId,
                    name: "Novo Produto",
                    category: "Sem categoria",
                    price: "$0.00",
                    image: "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg",
                  };
                  const updated = [...products, newProduct];
                  setProducts(updated);
                  saveData(heroImages, updated, categories);
                }}
                className="flex gap-2"
              >
                <Plus className="size-4" /> Novo Produto
              </Button>
            </div>

            {editingProduct ? (
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold">Editar Produto</h3>
                  <Button variant="ghost" size="icon" onClick={() => setEditingProduct(null)}><X className="size-4" /></Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome</label>
                    <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Categoria</label>
                    <input type="text" value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço</label>
                    <input type="text" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preço Antigo</label>
                    <input type="text" value={editingProduct.oldPrice || ""} onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value || undefined })} className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Badge</label>
                    <select
                      value={editingProduct.badge || ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        let tone: "new" | "best" | "sale" | undefined = undefined;
                        if (val === "NEW") tone = "new";
                        if (val === "BESTSELLER") tone = "best";
                        if (val === "SALE") tone = "sale";
                        setEditingProduct({ ...editingProduct, badge: val || undefined, tone });
                      }}
                      className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm"
                    >
                      <option value="">Nenhum</option>
                      <option value="NEW">NEW</option>
                      <option value="SALE">SALE</option>
                      <option value="BESTSELLER">BESTSELLER</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Imagem URL</label>
                    <input type="text" value={editingProduct.image} onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })} className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm" />
                  </div>
                </div>
                <img src={editingProduct.image} alt={editingProduct.name} className="w-full h-48 object-cover rounded-lg" />
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const updated = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
                      setProducts(updated);
                      saveData(heroImages, updated, categories);
                      setEditingProduct(null);
                    }}
                    className="flex gap-2 flex-1"
                  >
                    <Save className="size-4" /> Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditingProduct(null)} className="flex-1">Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-bold truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <p className="text-lg font-bold mt-2">{product.price}</p>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)} className="flex-1 flex gap-2"><Edit2 className="size-4" /> Editar</Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = products.filter((p) => p.id !== product.id);
                            setProducts(updated);
                            saveData(heroImages, updated, categories);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
                      {activeTab === "hero" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Banner Hero</h2>
              <Button
                onClick={() => {
                  const newImages = [...heroImages, "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg"];
                  setHeroImages(newImages);
                  saveData(newImages, products, categories);
                }}
                className="flex gap-2"
              >
                <Plus className="size-4" /> Adicionar Slide
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {heroImages.map((image, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg overflow-hidden">
                  {editingHeroIdx === idx ? (
                    <div className="p-4 space-y-4">
                      <label className="block text-sm font-medium">URL da Imagem</label>
                      <textarea
                        value={tempHeroImage}
                        onChange={(e) => setTempHeroImage(e.target.value)}
                        className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm h-24"
                      />
                      <img src={tempHeroImage} alt={`Hero ${idx}`} className="w-full h-40 object-cover rounded-lg" />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const updated = [...heroImages];
                            updated[idx] = tempHeroImage;
                            setHeroImages(updated);
                            saveData(updated, products, categories);
                            setEditingHeroIdx(null);
                          }}
                          className="flex-1"
                        >
                          <Save className="size-4 mr-2" /> Salvar
                        </Button>
                        <Button variant="outline" onClick={() => setEditingHeroIdx(null)}>Cancelar</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={image} alt={`Hero ${idx}`} className="w-full h-40 object-cover" />
                      <div className="p-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingHeroIdx(idx);
                            setTempHeroImage(image);
                          }}
                          className="flex-1"
                        >
                          <Edit2 className="size-4 mr-2" /> Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const updated = heroImages.filter((_, i) => i !== idx);
                            setHeroImages(updated);
                            saveData(updated, products, categories);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Categorias</h2>
              <Button
                onClick={() => {
                  const newCategory: Category = {
                    name: "Nova Categoria",
                    image: "https://images.pexels.com/photos/32912307/pexels-photo-32912307.jpeg",
                  };
                  const updated = [...categories, newCategory];
                  setCategories(updated);
                  saveData(heroImages, products, updated);
                }}
                className="flex gap-2"
              >
                <Plus className="size-4" /> Nova Categoria
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((category, idx) => (
                <div key={idx} className="bg-card border border-border rounded-lg overflow-hidden">
                  {editingCategoryIdx === idx && editingCategory ? (
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome</label>
                        <input
                          type="text"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">URL da Imagem</label>
                        <textarea
                          value={editingCategory.image}
                          onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                          className="w-full border border-border rounded-lg bg-background px-4 py-2 text-sm h-24"
                        />
                      </div>
                      <img src={editingCategory.image} alt={editingCategory.name} className="w-full h-40 object-cover rounded-lg" />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            const updated = [...categories];
                            updated[idx] = editingCategory;
                            setCategories(updated);
                            saveData(heroImages, products, updated);
                            setEditingCategoryIdx(null);
                            setEditingCategory(null);
                          }}
                          className="flex-1"
                        >
                          <Save className="size-4 mr-2" /> Salvar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingCategoryIdx(null);
                            setEditingCategory(null);
                          }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img src={category.image} alt={category.name} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="font-bold">{category.name}</h3>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingCategoryIdx(idx);
                              setEditingCategory({ ...category });
                            }}
                            className="flex-1"
                          >
                            <Edit2 className="size-4 mr-2" /> Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = categories.filter((_, i) => i !== idx);
                              setCategories(updated);
                              saveData(heroImages, products, updated);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
