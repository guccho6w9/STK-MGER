// src/app/page.jsx
// Este es el componente principal para la página de inicio en el App Router.
// 'use client' es necesario para poder usar hooks de React como useState y useEffect.
'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect se ejecuta una vez que el componente se monta.
  // Aquí, llamamos a nuestro API para obtener los productos.
  useEffect(() => {
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
    fetchProducts();
  }, []); // El array vacío asegura que se ejecute solo una vez.

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-6">
          Gestión de Inventario
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Controla tu stock de forma sencilla y eficiente.
        </p>

        {/* Sección de búsqueda y acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-md mb-8">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="flex-grow p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-auto mb-4 md:mb-0"
          />
          <button className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out w-full md:w-auto">
            + Agregar Producto
          </button>
        </div>

        {/* Muestra un mensaje de carga o los productos */}
        {loading ? (
          <div className="text-center text-gray-500 text-lg">Cargando productos...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row md:items-center justify-between transition-transform transform hover:scale-105 hover:shadow-lg duration-300"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <h2 className="text-xl font-bold text-gray-900">{product.description}</h2>
                    <div className="text-sm text-gray-500">
                      <p><span className="font-semibold">Código:</span> {product.code}</p>
                      <p><span className="font-semibold">Marca:</span> {product.brand}</p>
                      <p><span className="font-semibold">Precio:</span> ${product.price.toFixed(2)}</p>
                      <p><span className="font-semibold">Última actualización:</span> {new Date(product.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-300">
                      Editar
                    </button>
                    <button className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition duration-300">
                      Borrar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-lg">No hay productos en el inventario.</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}