import { describe, expect, it } from "vitest";
import { z } from "zod";
import { apiNullableNumber } from "../api-validation";

const schema = z.object({ value: apiNullableNumber() });

describe("apiNullableNumber", () => {
  it("passes through a real number", () => {
    expect(schema.parse({ value: 42 })).toEqual({ value: 42 });
  });

  it("coerces a numeric string", () => {
    expect(schema.parse({ value: "42" })).toEqual({ value: 42 });
  });

  it("maps null to null", () => {
    expect(schema.parse({ value: null })).toEqual({ value: null });
  });

  it("maps an empty string to null", () => {
    expect(schema.parse({ value: "" })).toEqual({ value: null });
  });

  it("maps a non-numeric string to null rather than throwing", () => {
    expect(schema.parse({ value: "brak danych" })).toEqual({ value: null });
  });
});
