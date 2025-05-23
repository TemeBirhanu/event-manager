import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export const eventSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: 'Invalid date format'
    }),
    location: z.string().min(3, 'Location must be at least 3 characters'),
    capacity: z.number().min(1, 'Capacity must be at least 1')
});

export type RegisterSchema = typeof registerSchema;
export type LoginSchema = typeof loginSchema; 