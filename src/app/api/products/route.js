// src/app/api/products/route.js
// Las API Routes en el App Router usan un formato diferente.
// Exportamos funciones HTTP (GET, POST, PUT, DELETE) directamente
import prisma from '../../../lib/prisma';
import { NextResponse } from 'next/server';

// Maneja peticiones GET para obtener todos los productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}

// Maneja peticiones POST para crear un nuevo producto
export async function POST(request) {
  try {
    const { code, description, brand, price } = await request.json();
    if (!code || !description || !brand || !price) {
      return NextResponse.json({ message: 'Faltan campos obligatorios.' }, { status: 400 });
    }
    const newProduct = await prisma.product.create({
      data: {
        code,
        description,
        brand,
        price: parseFloat(price),
      },
    });
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error.message);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
