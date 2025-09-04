'use client';

import { useState, useEffect } from 'react';

// Componente para el formulario de producto dentro de una modal
const ProductFormModal = ({ product, onClose, onSave }) => {
  const [formState, setFormState] = useState({
    code: '',
    description: '',
    brand: '',
    price: '',
  });

  useEffect(() => {
    if (product) {
      setFormState({
        code: product.code,
        description: product.description,
        brand: product.brand,
        price: product.price,
      });
    } else {
      setFormState({
        code: '',
        description: '',
        brand: '',
        price: '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formState);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
      <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          {product ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-900 mb-1">Código</label>
              <input
                type="text"
                id="code"
                name="code"
                value={formState.code}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">Descripción</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formState.description}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
              />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-900 mb-1">Marca</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formState.brand}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-900 mb-1">Precio</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formState.price}
                onChange={handleChange}
                step="0.01"
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-black"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition duration-300"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente para la vista de Presupuesto
const QuoteView = ({ products, onBack, onPrint }) => {
  const [quoteItems, setQuoteItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [surchargePercentage, setSurchargePercentage] = useState('');
  const [clientInfo, setClientInfo] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  const companyInfo = {
    name: 'Nombre del Corralón',
    address: 'Dirección del Corralón',
    phone: 'Teléfono del Corralón',
  };

  const handleAddItem = (product) => {
    const existingItem = quoteItems.find(item => item.id === product.id);
    if (existingItem) {
      setQuoteItems(
        quoteItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setQuoteItems([...quoteItems, {
        id: product.id,
        code: product.code,
        description: product.description,
        brand: product.brand,
        price: product.price, // Precio original del producto
        editablePrice: product.price, // Precio editable en el presupuesto
        quantity: 1
      }]);
    }
    setSearchQuery('');
  };

  const handleItemChange = (productId, field, value) => {
    setQuoteItems(
      quoteItems.map(item =>
        item.id === productId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveItem = (productId) => {
    setQuoteItems(quoteItems.filter(item => item.id !== productId));
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) return '0,00';
    const formattedPrice = new Intl.NumberFormat('es-AR', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
    return formattedPrice;
  };

  const filteredProducts = products.filter(
    (p) =>
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const subtotal = quoteItems.reduce((sum, item) => sum + item.editablePrice * (parseFloat(item.quantity) || 0), 0);
  const totalWithShipping = subtotal + (parseFloat(shippingCost) || 0);
  const totalWithSurcharge = totalWithShipping + totalWithShipping * ((parseFloat(surchargePercentage) || 0) / 100);

  return (
    <div className="p-4 md:p-8">
      <button onClick={onBack} className="mb-4 text-blue-600 font-semibold flex items-center no-print">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver al Inventario
      </button>

      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-6 no-print">
        Crear Presupuesto
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-md mb-8 no-print">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Seleccionar Productos</h2>
        <input
          type="text"
          id="quote-search-input"
          placeholder="Buscar productos para el presupuesto..."
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-black"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div id="product-list-dropdown" className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
          {searchQuery && filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 border-b last:border-b-0 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddItem(p)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-black">{p.description}</p>
                  <p className="text-sm text-gray-500">Código: {p.code} | Marca: {p.brand}</p>
                </div>
                <span className="font-bold text-gray-900">${formatPrice(p.price)}</span>
              </div>
            ))
          ) : searchQuery && filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No se encontraron productos.</div>
          ) : null}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md" id="quote-document">
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">{companyInfo.name}</h3>
            <p className="text-sm text-gray-600">{companyInfo.address}</p>
            <p className="text-sm text-gray-600">Tel: {companyInfo.phone}</p>
          </div>
          <div className="mt-4 md:mt-0 md:text-right">
            <h3 className="text-xl font-bold text-gray-800">Presupuesto</h3>
            <p className="text-sm text-gray-600">Fecha: {new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Válido hasta: {new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border border-gray-200 p-4 rounded-xl mb-6">
          <h4 className="font-semibold text-gray-700 mb-2">Información del Cliente</h4>
          <input type="text" placeholder="Nombre" className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black no-print" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}/>
          <input type="text" placeholder="Dirección" className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black no-print" value={clientInfo.address} onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}/>
          <input type="text" placeholder="Teléfono" className="w-full p-2 border border-gray-300 rounded-md mb-2 text-black no-print" value={clientInfo.phone} onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}/>
          <input type="email" placeholder="Email (opcional)" className="w-full p-2 border border-gray-300 rounded-md text-black no-print" value={clientInfo.email} onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}/>
          <p className="text-gray-900 font-semibold print-only">Cliente: {clientInfo.name}</p>
          <p className="text-gray-600 text-sm print-only">Dirección: {clientInfo.address}</p>
          <p className="text-gray-600 text-sm print-only">Teléfono: {clientInfo.phone}</p>
          <p className="text-gray-600 text-sm print-only">Email: {clientInfo.email}</p>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider no-print"></th>
              </tr>
            </thead>
            <tbody id="quote-items-body" className="bg-white divide-y divide-gray-200">
              {quoteItems.length > 0 ? (
                quoteItems.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        className="w-16 p-1 border border-gray-300 rounded-md text-black quantity-input no-print"
                      />
                      <span className="print-only">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="no-print">
                        $<input
                          type="number"
                          value={item.editablePrice}
                          onChange={(e) => handleItemChange(item.id, 'editablePrice', parseFloat(e.target.value))}
                          step="0.01"
                          className="w-24 p-1 border border-gray-300 rounded-md text-black"
                        />
                      </span>
                      <span className="print-only">$ {formatPrice(item.editablePrice)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">$ {formatPrice(item.editablePrice * (parseFloat(item.quantity) || 0))}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium no-print">
                      <button onClick={() => handleRemoveItem(item.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Agrega productos para crear tu presupuesto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col md:flex-row justify-end items-end space-y-4 md:space-y-0 md:space-x-8">
          <div className="w-full md:w-1/2 space-y-2 no-print">
            <div>
              <label htmlFor="shipping" className="block text-sm font-medium text-gray-700">Costo de Envío</label>
              <input type="number" id="shipping" className="w-full p-2 border border-gray-300 rounded-md text-black" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} step="0.01" />
            </div>
            <div>
              <label htmlFor="surcharge" className="block text-sm font-medium text-gray-700">Recargo de Tarjeta (%)</label>
              <input type="number" id="surcharge" className="w-full p-2 border border-gray-300 rounded-md text-black" value={surchargePercentage} onChange={(e) => setSurchargePercentage(e.target.value)} step="0.01" />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-right space-y-2">
            <p className="text-sm text-gray-600">Subtotal: <span className="font-bold text-gray-900">$ {formatPrice(subtotal)}</span></p>
            <p className="text-sm text-gray-600">Costo de Envío: <span className="font-bold text-gray-900">$ {formatPrice(shippingCost)}</span></p>
            <p className="text-sm text-gray-600">Recargo ({surchargePercentage || 0}%): <span className="font-bold text-gray-900">$ {formatPrice(totalWithShipping * ((parseFloat(surchargePercentage) || 0) / 100))}</span></p>
            <p className="text-2xl font-bold text-gray-900">Total: <span className="text-blue-600">$ {formatPrice(totalWithSurcharge)}</span></p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-red-500 font-semibold p-2 border border-red-300 rounded-xl bg-red-50 print-only">
          **Este documento es solo un presupuesto y no tiene validez como factura o documento legal.**
        </div>
      </div>
      
      <div className="flex justify-center mt-6 no-print">
        <button onClick={onPrint} className="bg-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-green-700 transition duration-300">
          Imprimir Presupuesto
        </button>
      </div>

      <style jsx global>
        {`
          @media print {
            .no-print {
              display: none;
            }
            body {
              background-color: white !important;
              color: black !important;
            }
            .print-only {
              display: block !important;
              width: 100% !important;
              box-shadow: none !important;
              padding: 0 !important;
              border: none !important;
            }
          }
          .print-only {
            display: none;
          }
          input[type="number"]::-webkit-inner-spin-button, 
          input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
          }
        `}
      </style>
    </div>
  );
};


// Función de ayuda para formatear el precio
const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) return '0,00';
  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  return formattedPrice;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleProductsCount, setVisibleProductsCount] = useState(10);
  const [currentView, setCurrentView] = useState('inventory');
  const PRODUCTS_PER_PAGE = 10;

  // Función para cargar los productos desde la API
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Error al cargar los productos');
      }
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddClick = () => {
    setCurrentProduct(null);
    setShowModal(true);
  };

  const handleEditClick = (product) => {
    setCurrentProduct(product);
    setShowModal(true);
  };

  const handleDeleteClick = async (productId) => {
    try {
      // Reemplazando window.confirm()
      console.log('Se ha solicitado eliminar el producto con ID:', productId);
      // Puedes agregar una lógica de confirmación aquí (ej. un modal personalizado)
      // Por ahora, procederemos con la eliminación.
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        throw new Error('Error al eliminar el producto');
      }
      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      const isEditing = !!currentProduct;
      const url = isEditing ? `/api/products/${currentProduct.id}` : '/api/products';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Error al guardar el producto');
      }

      setShowModal(false);
      await fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice(0, visibleProductsCount);

  const handleLoadMore = () => {
    setVisibleProductsCount(prevCount => prevCount + PRODUCTS_PER_PAGE);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
        {currentView === 'inventory' ? (
          <>
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-6">
              Gestión de Inventario
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Controla tu stock de forma sencilla y eficiente.
            </p>

            <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="flex-grow p-3 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto mb-4 md:mb-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="flex space-x-2 w-full md:w-auto">
                <button
                  onClick={handleAddClick}
                  className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out flex-1"
                >
                  + Agregar Producto
                </button>
                <button
                  onClick={() => setCurrentView('quote')}
                  className="bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 transition duration-300 ease-in-out flex-1"
                >
                  Crear Presupuesto
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 text-lg">Cargando productos...</div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
                    >
                      <div className="flex-1 mb-4 md:mb-0">
                        <h2 className="text-xl font-bold text-gray-900">{product.description}</h2>
                        <div className="text-sm text-gray-500">
                          <p><span className="font-semibold">Código:</span> {product.code}</p>
                          <p><span className="font-semibold">Marca:</span> {product.brand}</p>
                          <p>
                            <span className="font-semibold">Precio:</span>{' '}
                            <span className="font-bold text-gray-900">${formatPrice(product.price)}</span>
                          </p>
                          <p><span className="font-semibold">Última actualización:</span> {new Date(product.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditClick(product)}
                          className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteClick(product.id)}
                          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 text-lg">No hay productos que coincidan con la búsqueda.</div>
                )}
                
                {paginatedProducts.length > 0 && paginatedProducts.length < filteredProducts.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={handleLoadMore}
                      className="bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out w-full md:w-auto"
                    >
                      Cargar más productos
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <QuoteView products={products} onBack={() => setCurrentView('inventory')} onPrint={handlePrint} />
        )}
      </main>

      {showModal && (
        <ProductFormModal
          product={currentProduct}
          onClose={() => setShowModal(false)}
          onSave={handleFormSubmit}
        />
      )}
    </div>
  );
}
