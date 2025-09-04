'use client';

import { useEffect, useState } from 'react';

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

// Función de ayuda para formatear el precio con puntos de miles y dos decimales
const formatPrice = (price) => {
  if (price === null || price === undefined) return '';
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
      // Reemplazar la alerta nativa con una ventana modal
      const userConfirmed = window.confirm('¿Estás seguro de que quieres eliminar este producto?');
      if (userConfirmed) {
        const res = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          throw new Error('Error al eliminar el producto');
        }
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el producto');
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
      alert('Error al guardar el producto');
    }
  };

  // Filtrar todos los productos en tiempo real basándose en el estado de búsqueda
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

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
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
          <button
            onClick={handleAddClick}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out w-full md:w-auto"
          >
            + Agregar Producto
          </button>
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
            
            {/* Botón para cargar más productos, visible solo si hay más productos para mostrar */}
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
