import { useEffect, useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/Button";
import {
  createProduct,
  getProductsForAdmin,
  removeProduct,
  updateProduct,
  type ProductRecord,
} from "@/services/adminProducts";
import { useSeo } from "@/hooks/useSeo";
import { uploadProductImage } from "@/services/storage";

type ProductFormState = {
  name: string;
  slug: string;
  type: string;
  description: string;
  origin: string;
  cookingQuality: string;
  price: string;
  samplePrice: string;
  weights: string;
  image: string;
};

const emptyForm: ProductFormState = {
  name: "",
  slug: "",
  type: "",
  description: "",
  origin: "",
  cookingQuality: "",
  price: "",
  samplePrice: "",
  weights: "1kg,5kg",
  image: "",
};

const ProductsAdminPage = () => {
  useSeo({
    title: "Admin Products | Vari Agro Foods",
    description: "Manage rice products, pricing, and inventory in Vari Agro Foods admin dashboard.",
    canonicalPath: "/admin/products",
  });

  const [items, setItems] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [status, setStatus] = useState("");

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsForAdmin(200);
      setItems(data);
    } catch (error) {
      console.error("Failed to load admin products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const createNewProduct = async () => {
    if (!form.name || !form.slug || !form.type || !form.price || !form.samplePrice || !form.image) {
      setStatus("Please fill required fields: name, slug, type, price, sample price, image.");
      return;
    }

    try {
      await createProduct({
        name: form.name,
        slug: form.slug,
        type: form.type,
        description: form.description || form.name,
        origin: form.origin || "India",
        cookingQuality: form.cookingQuality || "Fluffy",
        price: Number(form.price),
        samplePrice: Number(form.samplePrice),
        weights: form.weights.split(",").map((value) => value.trim()).filter(Boolean),
        stock: 120,
        ratingAverage: 4.6,
        ratingCount: 0,
        popularityScore: 50,
        featured: false,
        isNewArrival: true,
        images: [form.image],
      });

      setForm(emptyForm);
      setStatus("Product created.");
      await loadProducts();
    } catch (error) {
      console.error("Failed to create product", error);
      setStatus("Product creation failed.");
    }
  };

  const markFeatured = async (productId: string, featured: boolean) => {
    try {
      await updateProduct(productId, { featured });
      await loadProducts();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await removeProduct(productId);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  const quickUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setStatus("Uploading image...");
      const imageUrl = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, image: imageUrl }));
      setStatus("Image uploaded and linked.");
    } catch (error) {
      console.error("Failed to preview image", error);
      setStatus("Image upload failed.");
    }
  };

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-green">Product Management</p>
      <h2 className="mt-2 font-heading text-3xl font-bold text-[#2b1f14]">Products</h2>

      <article className="mt-5 rounded-2xl border border-[#efe4d6] bg-[#fffcf8] p-4">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Add Product</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <input
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Product name"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.slug}
            onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
            placeholder="Slug"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            placeholder="Type"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.origin}
            onChange={(event) => setForm((prev) => ({ ...prev, origin: event.target.value }))}
            placeholder="Origin"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="Price"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.samplePrice}
            onChange={(event) => setForm((prev) => ({ ...prev, samplePrice: event.target.value }))}
            placeholder="Sample price"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.weights}
            onChange={(event) => setForm((prev) => ({ ...prev, weights: event.target.value }))}
            placeholder="Weights e.g. 1kg,5kg"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input
            value={form.image}
            onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
            placeholder="Image URL"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm"
          />
          <input type="file" accept="image/*" onChange={quickUploadImages} className="h-10 text-sm" />
          <input
            value={form.cookingQuality}
            onChange={(event) => setForm((prev) => ({ ...prev, cookingQuality: event.target.value }))}
            placeholder="Cooking quality"
            className="h-10 rounded-lg border border-[#e8dfd1] px-3 text-sm md:col-span-2"
          />
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Description"
            className="rounded-lg border border-[#e8dfd1] p-3 text-sm md:col-span-2"
            rows={3}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Button className="h-9 px-4" onClick={() => void createNewProduct()}>
            Add Product
          </Button>
          {status ? <p className="text-sm text-[#5d554c]">{status}</p> : null}
        </div>
      </article>

      <article className="mt-6 rounded-2xl border border-[#efe4d6] bg-white p-4 shadow-soft">
        <h3 className="font-heading text-xl font-bold text-[#2b1f14]">Existing Products</h3>

        {loading ? (
          <p className="mt-3 text-sm text-[#5d554c]">Loading products...</p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-[#f1e6d8] bg-[#fffdf9] p-3 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-semibold text-[#2b1f14]">{item.data.name}</p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#7a6d5f]">
                    {item.data.type} · ₹{item.data.price.toLocaleString()} · {item.data.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="h-8 px-3"
                    onClick={() => void markFeatured(item.id, !item.data.featured)}
                  >
                    {item.data.featured ? "Unfeature" : "Feature"}
                  </Button>
                  <Button className="h-8 px-3" onClick={() => void deleteProduct(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            {items.length === 0 ? <p className="text-sm text-[#5d554c]">No products found.</p> : null}
          </div>
        )}
      </article>
    </div>
  );
};

export default ProductsAdminPage;
