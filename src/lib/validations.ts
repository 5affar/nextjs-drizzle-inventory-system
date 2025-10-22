import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Product name must be less than 100 characters')
    .trim(),
  sku: z
    .string()
    .min(1, 'SKU is required')
    .max(50, 'SKU must be less than 50 characters')
    .trim(),
  price: z
    .number()
    .positive('Price must be positive')
    .finite('Price must be a valid number')
    .max(999999.99, 'Price must be less than 1,000,000'),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .max(999999, 'Stock must be less than 1,000,000'),
});

export const UpdateProductSchema = CreateProductSchema.extend({
  id: z
    .string()
    .min(1, 'Product ID is required')
    .or(z.number().int().positive('Product ID must be a positive integer')),
});

export const ProductFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required'),
  stock: z.string().min(1, 'Stock is required'),
});

export const CreateOrderItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be a positive integer'),
  quantity: z.number().int().positive('Quantity must be positive'),
});

export const CreateOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name must be less than 100 characters')
    .trim(),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  items: z
    .array(CreateOrderItemSchema)
    .min(1, 'At least one item is required')
    .max(50, 'Maximum 50 items per order'),
});

export const OrderItemFormSchema = z.object({
  productId: z.string().min(1, 'Please select a product'),
  quantity: z.string().min(1, 'Quantity is required'),
});

export const OrderFormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  notes: z.string().optional(),
  items: z.array(OrderItemFormSchema).min(1, 'At least one item is required'),
});

export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type ProductForm = z.infer<typeof ProductFormSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type CreateOrderItem = z.infer<typeof CreateOrderItemSchema>;
export type OrderForm = z.infer<typeof OrderFormSchema>;
export type OrderItemForm = z.infer<typeof OrderItemFormSchema>;