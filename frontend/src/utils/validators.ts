import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['client', 'student']),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  university: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const gigSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(100),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000),
  budget: z.number().min(500, 'Minimum budget is ₹500'),
  category: z.string().min(1, 'Category is required'),
  deadline: z.date(),
  skillsRequired: z.array(z.string()).min(1, 'At least one skill is required'),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Milestone title is required'),
    description: z.string().min(1, 'Milestone description is required'),
    amount: z.number().min(1, 'Milestone amount must be positive'),
    dueDate: z.date(),
  })).min(1, 'At least one milestone is required'),
});

export const applicationSchema = z.object({
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters').max(1000),
  proposedBudget: z.number().min(1, 'Proposed budget must be positive'),
});

export const milestoneSubmissionSchema = z.object({
  submissionUrl: z.string().url('Invalid URL'),
  notes: z.string().optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(500),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  university: z.string().optional(),
  skills: z.array(z.string()).optional(),
  portfolio: z.string().url('Invalid URL').optional(),
});
