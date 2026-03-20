import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

function Cart() {
  const { cart, loading, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setCouponLoading(true);
    setCouponMsg({ type: '', text: '' });

    const result = await applyCoupon(couponCode.trim());

    if (result.success) {
      setCouponMsg({ type: 'success', text: 'Cupom aplicado com sucesso!' });
      setCouponCode('');
    } else {
      setCouponMsg({ type: 'error', text: result.error || 'Cupom inválido' });
    }

    setCouponLoading(false);
  };

  if (loading && !cart?.items?.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Carrinho</h1>

      {isEmpty ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Seu carrinho está vazio</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Adicione produtos incríveis para começar a sua compra! Explore nosso catálogo e encontre o que precisa.
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-[#40a543] hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-full transition-colors"
          >
            <span>Voltar às Compras</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">
              Itens do Pedido ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})
            </h2>
            
            <div className="flex flex-col">
              {cart.items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Resumo</h2>
              
              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">R$ {cart.total.toFixed(2).replace('.', ',')}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      Desconto {cart.applied_coupon && `(${cart.applied_coupon})`}
                    </span>
                    <span className="font-medium">- R$ {cart.discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                
                <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-blue-600">R$ {cart.final_total.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Coupon Form */}
              <div className="mb-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Possui cupom de desconto?</p>
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Digite seu cupom"
                    className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase placeholder:normal-case"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading || !couponCode.trim()}
                    className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg px-4 py-2 font-medium text-sm transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Aplicar'}
                  </button>
                </form>
                {couponMsg.text && (
                  <p className={`text-xs mt-2 ${couponMsg.type === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2">
                <span>Finalizar Compra</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-blue-600 hover:underline font-medium">
                  Continuar comprando
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
