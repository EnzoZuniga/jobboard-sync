import { z } from 'zod';

export const OfferSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.string(),
  location: z.string().optional(),
  remote: z.boolean().default(false),
  contractType: z.enum(['CDI', 'CDD', 'freelance', 'internship', 'other']),
  salary: z
    .object({
      min: z.number().optional(),
      max: z.number().optional(),
      currency: z.string().default('EUR'),
    })
    .optional(),
  postedAt: z.string().datetime(),
  url: z.string().url().optional(),
});

export type Offer = z.infer<typeof OfferSchema>;
