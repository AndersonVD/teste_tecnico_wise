import React, { useEffect, useState } from 'react';
import { productApi } from '../services/api';
import ProductCard from '../components/ProductCard';

function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const categories = ['Todos', 'roupas', 'calçados', 'acessórios'];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const categoryParam = selectedCategory === 'Todos' ? null : selectedCategory;
        const res = await productApi.getProducts(categoryParam);
        setProducts(res.data);
        setError(null);
      } catch (err) {
        setError('Falha ao carregar produtos. Verifique se o servidor está rodando.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Produtos</h1>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-[#40a543] text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat === 'Todos' ? cat : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-700 p-6 rounded-xl text-center">
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <div key={i} className="animate-pulse flex space-x-4">
               <div className="rounded-xl bg-slate-200 h-80 w-full"></div>
             </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">Nenhum produto encontrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;
