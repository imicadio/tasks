import { z } from "zod";
import { MAX_YEAR, MIN_YEAR } from "./constants";

export const metricSchema = z.enum(["accidents", "fatalities", "injured"]);

// Shape of a GUS BDL `/data/by-variable/{id}` response — validated live
// against https://bdl.stat.gov.pl/api/v1.
export const gusValueSchema = z.object({
  year: z.string(),
  val: z.number().nullable(),
  attrId: z.number(),
});

export const gusByVariableResponseSchema = z.object({
  totalRecords: z.number(),
  results: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      values: z.array(gusValueSchema),
    }),
  ),
});

export const trendQuerySchema = z.object({
  metric: metricSchema,
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(15),
});

export const breakdownQuerySchema = z.object({
  metric: metricSchema,
  year: z.coerce.number().int().min(MIN_YEAR).max(MAX_YEAR),
});
