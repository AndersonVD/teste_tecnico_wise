import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 0) return;
    
    setLoading(true);
    setErrorMsg('');
    
    const result = await updateQuantity(item.id, newQuantity);
    
    if (!result.success) {
      setErrorMsg(result.error);
      setTimeout(() => setErrorMsg(''), 3000);
    }
    
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    await removeItem(item.id);
    setLoading(false);
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-100 last:border-0 relative">
      <div className="w-20 h-20 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center overflow-hidden mb-3 sm:mb-0 mr-4">
         {item.image_url ? (
            <img src={item.image_url} alt={item.product_name} className="object-cover w-full h-full" />
          ) : (
            <div className="text-gray-300 text-xs text-center px-1">Img</div>
          )}
      </div>
      
      <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between w-full">
        <div className="mb-2 sm:mb-0">
          <h4 className="font-semibold text-gray-800">{item.product_name}</h4>
          <p className="text-sm text-gray-500">R$ {item.unit_price.toFixed(2).replace('.', ',')} / un</p>
          {errorMsg && <p className="text-red-500 text-xs absolute -bottom-5 left-24">{errorMsg}</p>}
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
            <button 
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              disabled={loading}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-6 text-center font-medium font-mono">{item.quantity}</span>
            <button 
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              disabled={loading || item.quantity >= item.stock}
              className="p-1 text-gray-500 hover:text-black hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
              title={item.quantity >= item.stock ? "Estoque máximo atingido" : ""}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          
          <div className="text-right min-w-[5rem]">
            <p className="font-bold text-gray-900">R$ {item.subtotal.toFixed(2).replace('.', ',')}</p>
          </div>
          
          <button 
            onClick={handleRemove}
            disabled={loading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
            title="Remover item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
