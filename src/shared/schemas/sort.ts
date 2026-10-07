import { z } from "zod";
import { SORT_DIRECTION } from "@/shared/constants/sort";

export const sortDirectionSchema = z.enum(SORT_DIRECTION);
