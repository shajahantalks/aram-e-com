import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, Search, Sparkles } from 'lucide-react';
import { Product, Category, Language } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductCatalogProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  language: Language;
  onAddToCart: (product: Product) => void;
  onQuickView: (product: Product) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  categories,
  selectedCategoryId,
  onSelectCategory,
  language,
  onAddToCart,
  onQuickView,
  searchQuery,
  onSearchChange,
}) => {
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategoryId && selectedCategoryId !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.nameTa.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q)
      );
    }

    // In-stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategoryId, searchQuery, inStockOnly, sortBy]);

  const activeCategory = categories.find((c) => c.id === selectedCategoryId);

  return (
    <div className="py-8 bg-[#FDFBF7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="border-b border-amber-200/60 pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{language === 'ta' ? 'அறம் பாரம்பரிய அங்காடி' : 'Aram Heritage Catalog'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#2C1810] font-heading">
                {activeCategory
                  ? language === 'ta'
                    ? activeCategory.nameTa
                    : activeCategory.name
                  : language === 'ta'
                  ? 'அனைத்து தமிழ் கைவினைப் பொருட்கள்'
                  : 'All Tamil Heritage & Temple Crafts'}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                {activeCategory
                  ? language === 'ta'
                    ? activeCategory.descriptionTa
                    : activeCategory.description
                  : language === 'ta'
                  ? 'சுவாமிமலை வெண்கலம், காஞ்சி பட்டு, நாச்சியார்கோவில் பித்தளை உள்ளிட்டவை.'
                  : 'Explore sacred idols, pure handlooms, virgin cold-pressed oils, and puja essentials.'}
              </p>
            </div>

            {/* Total Results Count */}
            <div className="text-xs text-stone-700 bg-yellow-100/70 px-3 py-1.5 rounded-full border border-yellow-300 self-start md:self-auto font-medium">
              Showing <span className="font-bold text-[#B45309]">{filteredProducts.length}</span> authentic crafts
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll / Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-yellow-400 text-stone-950 font-black shadow-xs border border-yellow-500'
                : 'bg-white border border-yellow-200 text-stone-700 hover:bg-yellow-50'
            }`}
          >
            {language === 'ta' ? 'அனைத்தும் (All)' : 'All Crafts'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition shrink-0 cursor-pointer ${
                selectedCategoryId === cat.id
                  ? 'bg-yellow-400 text-stone-950 font-black shadow-xs border border-yellow-500'
                  : 'bg-white border border-yellow-200 text-stone-700 hover:bg-yellow-50'
              }`}
            >
              {language === 'ta' ? cat.nameTa : cat.name}
            </button>
          ))}
        </div>

        {/* Toolbar: Search input, In Stock checkbox, Sort select */}
        <div className="bg-white p-3.5 rounded-xl border border-yellow-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Search Input in Catalog */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'பெயர் அல்லது ஊர் மூலம் தேடுக...'
                  : 'Search by craft name, origin, or material...'
              }
              className="w-full pl-8 pr-3 py-1.5 border border-stone-300 rounded-lg text-xs focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
            />
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            {/* In stock toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 font-medium">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-amber-500 focus:ring-yellow-400"
              />
              <span>In-Stock Only</span>
            </label>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-stone-300 rounded-lg px-2.5 py-1 text-xs bg-white text-stone-800 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-400"
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                language={language}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-yellow-300 p-8 space-y-4 max-w-lg mx-auto">
            <span className="text-4xl">🪔</span>
            <h3 className="text-base font-bold text-stone-800 font-heading">
              {language === 'ta'
                ? 'பொருட்கள் எதுவும் கிடைக்கவில்லை'
                : 'No traditional crafts match your search'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'வேறு சொல் அல்லது பிரிவை தேர்ந்தெடுத்து மீண்டும் தேடவும்.'
                : 'Try clearing your search query or selecting a different category from above.'}
            </p>
            <button
              onClick={() => {
                onSearchChange('');
                onSelectCategory('all');
                setInStockOnly(false);
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-stone-950 rounded-lg text-xs font-bold hover:from-yellow-300 hover:to-amber-300 shadow-xs border border-yellow-500 transition cursor-pointer"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
