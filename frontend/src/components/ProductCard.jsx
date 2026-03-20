import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const cartItem = cart?.items?.find(item => item.product_id === product.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  
  const availableStock = product.stock - cartQuantity;
  const isOutOfStock = availableStock <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock) return;
    
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    const result = await addToCart(product.id, 1);
    
    if (!result.success) {
      setErrorMsg(result.error);
    } else {
      setSuccessMsg('Adicionado!');
      setTimeout(() => setSuccessMsg(''), 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-transform hover:shadow-md ${isOutOfStock ? 'opacity-70 grayscale-[0.3]' : ''}`}>
      <div className="h-48 bg-gray-200 flex items-center justify-center relative">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="object-cover w-full h-full" />
        ) : (
          <div className="text-gray-400 font-medium text-lg">Sem Imagem</div>
        )}
        
        {isOutOfStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow uppercase tracking-wide">
            Esgotado
          </div>
        )}
        {!isOutOfStock && availableStock <= 3 && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            Restam {availableStock}
          </div>
        )}
      </div>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">{product.category}</div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">{product.name}</h3>
        <p className="text-2xl font-extrabold text-gray-900 mt-auto mb-4">
          R$ {product.price.toFixed(2).replace('.', ',')}
        </p>
        
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || loading}
          className={`w-full py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all ${
             isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : successMsg 
                ? 'bg-green-500 hover:bg-green-600 text-white shadow-sm'
                : 'bg-[#40a543] hover:bg-blue-700 text-white shadow-sm hover:shadow active:scale-[0.98]'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              <span>{isOutOfStock ? 'Indisponível' : successMsg || 'Adicionar'}</span>
            </>
          )}
        </button>
        
        {errorMsg && <p className="text-red-500 text-xs mt-2 text-center">{errorMsg}</p>}
      </div>
    </div>
  );
}

export default ProductCard;
