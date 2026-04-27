import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Plus, Minus, ArrowLeft, Loader2, Info } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'T-Shirt' | 'Hat';
  description: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'tshirt-1',
    name: 'Bittensor Node T-Shirt',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'T-Shirt',
    description: 'Black, premium cotton T-shirt featuring a subtle Bittensor logo on the front left chest.'
  },
  {
    id: 'hat-1',
    name: 'Shizzy Unchained Dad Hat',
    price: 25.00,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Hat',
    description: 'Classic dad hat with the Shizzy Unchained logo embroidered.'
  },
  {
    id: 'tshirt-2',
    name: 'Subnet Alpha Hoodie',
    price: 55.00,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'T-Shirt',
    description: 'Comfortable heavyweight hoodie for the true subnet validators.'
  },
  {
    id: 'hat-2',
    name: 'TAO Beanie',
    price: 20.00,
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // Replace with beanie img if available
    category: 'Hat',
    description: 'Keep your head warm while charting the TAO breakout.'
  }
];

export const Shop: React.FC<{ onViewChange: (view: any) => void }> = ({ onViewChange }) => {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);
    setError(null);

    const items = cart.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during checkout. Did you add the Stripe API key?');
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 pt-32 pb-24 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Products List */}
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
              Latest Gear
            </h1>
            <p className="text-slate-500 dark:text-white/60 text-lg max-w-xl">
              High-quality apparel for the Bittensor ecosystem. Stand out while contributing to decentralized AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {PRODUCTS.map(product => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-xl"
              >
                <div className="h-64 overflow-hidden relative bg-slate-100 dark:bg-black/20">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-80 mix-blend-multiply dark:mix-blend-lighten" />
                  <div className="absolute top-4 left-4 bg-slate-900 text-white dark:bg-white dark:text-black px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-space font-black uppercase tracking-wider text-slate-900 dark:text-white">{product.name}</h3>
                    <p className="text-slate-500 dark:text-white/50 text-sm mt-2">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-mono text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="bg-slate-900 text-white dark:bg-white dark:text-black px-6 py-2 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sticky top-32 space-y-6 shadow-xl text-slate-900 dark:text-white">
            <h2 className="text-2xl font-space font-black uppercase tracking-wider flex items-center gap-3">
              <ShoppingCart size={24} />
              Your Cart
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-white/40 space-y-4">
                <ShoppingCart size={48} className="mx-auto opacity-20" />
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 max-h-[400px] hover:overflow-y-auto overflow-hidden pr-2">
                  <AnimatePresence>
                    {cart.map(item => (
                      <motion.div 
                        key={item.product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-3 rounded-2xl border border-slate-200 dark:border-white/5"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-lighten" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-sm font-bold truncate max-w-[120px]">{item.product.name}</h4>
                          <span className="text-slate-500 dark:text-white/60 text-xs">${item.product.price.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-200 dark:bg-white/10 rounded-lg p-1">
                          <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 hover:bg-slate-300 dark:hover:bg-white/20 rounded-md">
                            <Minus size={14} />
                          </button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 hover:bg-slate-300 dark:hover:bg-white/20 rounded-md">
                            <Plus size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="pt-6 border-t border-slate-200 dark:border-white/10 space-y-4">
                  <div className="flex items-center justify-between font-mono text-lg">
                    <span className="text-slate-500 dark:text-white/60">Total</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl flex items-start gap-2 text-sm">
                      <Info size={16} className="shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button 
                    onClick={handleCheckout}
                    disabled={isCheckingOut}
                    className="w-full bg-[#FF6321] hover:bg-[#E5591D] text-white font-black uppercase tracking-widest py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-orange-500/20 shadow-[0_0_15px_rgba(255,99,33,0.3)]"
                  >
                    {isCheckingOut ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : (
                      'Proceed to Checkout'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
