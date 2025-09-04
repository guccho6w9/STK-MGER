// pages/api/products.js
// Maneja las peticiones GET (para obtener todos los productos) y POST (para crear uno nuevo).

import prisma from '../../generated/prisma';

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      try {
        const products = await prisma.product.findMany({
          orderBy: { updatedAt: 'desc' },
        });
        return res.status(200).json(products);
      } catch (error) {
        console.error('Error al obtener productos:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    case 'POST':
      try {
        const { code, description, brand, price } = req.body;
        // Valida que los campos obligatorios existan
        if (!code || !description || !brand || !price) {
          return res.status(400).json({ message: 'Faltan campos obligatorios.' });
        }
        const newProduct = await prisma.product.create({
          data: {
            code,
            description,
            brand,
            price: parseFloat(price), // Asegura que el precio sea un número
          },
        });
        return res.status(201).json(newProduct);
      } catch (error) {
        console.error('Error al crear producto:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    default:
      // Envía un error 405 si el método de la petición no es soportado
      return res.status(405).json({ message: 'Método no permitido.' });
  }
}