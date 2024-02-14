import { EditionStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const createEditionSchema = z.object({
  name: z.string(),
  draw_date: z.string().transform((value) => new Date(value)),
  order: z.number().nullish(),
  status: z.nativeEnum(EditionStatus).default(EditionStatus.OPEN),
  value: z
    .string()
    .nullish()
    .default('5')
    .transform((value) => Number(value.replace(/\D/g, ''))),
  initial_title: z.string().nullish(),
  end_title: z.string().nullish(),

  initial_title_double_chance: z.string().nullish(),
  end_title_double_chance: z.string().nullish(),

  initial_title_triple_chance: z.string().nullish(),
  end_title_triple_chance: z.string().nullish(),
  
  value_double: z
  .string()
  .nullish()
  .default('10')
  .transform((value) => Number(value.replace(/\D/g, ''))),
  value_triple:z
  .string()
  .nullish()
  .default('15')
  .transform((value) => Number(value.replace(/\D/g, ''))),
});

export class CreateEditionDto extends createZodDto(createEditionSchema) {}
