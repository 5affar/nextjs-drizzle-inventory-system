import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { CreateProductSchema, UpdateProductSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET() {
  try {
    const result = await db.select().from(products);
    return NextResponse.json({ products: result }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = CreateProductSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { name, sku, price, stock } = validationResult.data;

    const result = await db.insert(products).values({
      name,
      sku,
      price,
      stock,
    });

    return NextResponse.json(
      { message: 'Product created successfully' },
      { status: 201 }
    );
  } 
  catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: { message: 'Failed to create product', details: err instanceof Error ? err.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = UpdateProductSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationResult.error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }

    const { id, name, sku, price, stock } = validationResult.data;
    
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;

    const result = await db.update(products)
      .set({
        name,
        sku,
        price,
        stock,
        createdAt: new Date(),
      })
      .where(eq(products.id, productId));

    return NextResponse.json(
      { message: 'Product updated successfully' },
      { status: 200 }
    );
  } 
  catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
          }))
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: { message: 'Failed to update product', details: err instanceof Error ? err.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const productId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const productWithOrderItems = await db.query.products.findFirst({
      where: eq(products.id, productId),
      with: {
        orderItems: {
          limit: 1, 
        },
      },
    });

    if (!productWithOrderItems) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (productWithOrderItems.orderItems.length > 0) {
      return NextResponse.json(
        { 
          error: `Cannot delete product. It is referenced in order(s). Products with order history cannot be deleted for data integrity.` 
        },
        { status: 409 }
      );
    }

    const result = await db.delete(products)
      .where(eq(products.id, productId));

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } 
  catch (err) {
    return NextResponse.json(
      { error: { message: 'Failed to delete product', details: err instanceof Error ? err.message : 'Unknown error' } },
      { status: 500 }
    );
  }
}