import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems, products } from '@/db/schema';
import { eq, sql, inArray } from 'drizzle-orm';
import { CreateOrderSchema } from '@/lib/validations';
import { z } from 'zod';

export async function GET() {
  try {
    const allOrders = await db.query.orders.findMany({
      orderBy: sql`${orders.createdAt} DESC`,
      with: {
        items: true,
      },
    });
    
    const ordersWithTotals = allOrders.map((order) => {
      const total = order.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      
      return {
        ...order,
        total
      };
    });

    return NextResponse.json({ orders: ordersWithTotals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validationResult = CreateOrderSchema.safeParse(body);
    
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

    const { customerName, notes, items } = validationResult.data;

    const result = await db.transaction(async (tx) => {
      const productIds = items.map(item => item.productId);
      const productsResult = await tx
        .select()
        .from(products)
        .where(inArray(products.id, productIds));

      const productsMap = new Map(productsResult.map(p => [p.id, p]));

      for (const item of items) {
        const product = productsMap.get(item.productId);

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }
      }

      const [order] = await tx
        .insert(orders)
        .values({
          customerName,
          notes: notes || null,
        })
        .returning();

      for (const item of items) {
        const product = productsMap.get(item.productId)!;

        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: product.price,
        });

        await tx
          .update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
          })
          .where(eq(products.id, item.productId));
      }

      return order;
    });

    return NextResponse.json(
      { 
        message: 'Order created successfully', 
        orderId: result.id 
      },
      { status: 201 }
    );
  } 
  catch (err) {
    console.error('Error creating order:', err);
    
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
    
    if (err instanceof Error && (err.message.includes('not found') || err.message.includes('Insufficient stock'))) {
      return NextResponse.json(
        { error: err.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}