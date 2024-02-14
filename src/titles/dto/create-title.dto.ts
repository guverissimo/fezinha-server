import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const titleSchema = z.object({
  name: z.string(),
  name_double: z.string().nullish(),
  name_triple: z.string().nullish(),
  dozens: z.string().array(),
  dozens_double: z.string().array().nullish(),
  dozens_triple: z.string().array().nullish(),
  user_id: z.string().nullish(),
  value: z.number(),
  chances: z.number().default(1),

  bar_code: z.string().nullish(),
  qr_code: z.string().nullish(),
});

export class CreateTitleDto extends createZodDto(titleSchema) {}

