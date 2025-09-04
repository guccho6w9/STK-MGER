// Este archivo maneja las peticiones para un producto específico (por ID).
// La sintaxis [id] en el nombre del archivo es un parámetro dinámico de Next.js.
import prisma from '../../../../lib/prisma';
import { NextResponse } from 'next/server';

// Maneja peticiones PUT para actualizar un producto por su ID
export async function PUT(request, { params }) {
  try {
    const { code, description, brand, price } = await request.json();

    if (!code || !description || !brand || !price) {
      return NextResponse.json({ message: 'Faltan campos obligatorios.' }, { status: 400 });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        code,
        description,
        brand,
        price: parseFloat(price),
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error al actualizar producto:', error.message);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// Maneja peticiones DELETE para eliminar un producto por su ID
export async function DELETE(request, { params }) {
  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}