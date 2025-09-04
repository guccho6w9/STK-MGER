// pages/api/products/[id].js
// Maneja las peticiones PUT (editar) y DELETE (eliminar).

import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;

  switch (req.method) {
    case 'PUT':
      try {
        const { code, description, brand, price } = req.body;
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            code,
            description,
            brand,
            price: parseFloat(price),
          },
        });
        return res.status(200).json(updatedProduct);
      } catch (error) {
        console.error('Error al actualizar producto:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    case 'DELETE':
      try {
        await prisma.product.delete({
          where: { id },
        });
        return res.status(204).end(); // 204 No Content
      } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
      }

    default:
      return res.status(405).json({ message: 'Método no permitido.' });
  }
}