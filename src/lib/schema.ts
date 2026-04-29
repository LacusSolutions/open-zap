import { z } from 'zod';

import { LINK_VARIANTS, MAX_MESSAGE_LENGTH } from './whatsapp';

export const formSchema = z.object({
  variant: z.enum(LINK_VARIANTS),
  country: z.string().min(2).max(2).optional().default('BR'),
  phone: z.string().max(30).optional().default(''),
  shortCode: z.string().max(32).optional().default(''),
  text: z.string().max(MAX_MESSAGE_LENGTH).optional().default(''),
  utm: z
    .object({
      source: z.string().max(80).optional().default(''),
      medium: z.string().max(80).optional().default(''),
      campaign: z.string().max(80).optional().default(''),
      content: z.string().max(80).optional().default(''),
      term: z.string().max(80).optional().default(''),
    })
    .optional()
    .default({ source: '', medium: '', campaign: '', content: '', term: '' }),
  showUtm: z.boolean().optional().default(false),
});

export type FormValues = z.infer<typeof formSchema>;

export const DEFAULT_VALUES: FormValues = {
  variant: 'wa',
  country: 'BR',
  phone: '',
  shortCode: '',
  text: '',
  utm: { source: '', medium: '', campaign: '', content: '', term: '' },
  showUtm: false,
};
