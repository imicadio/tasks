import type { ChangeEvent } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  checkboxFieldHandler,
  textFieldHandler,
  valueFieldHandler,
} from "../field-handlers";

describe("field handlers", () => {
  it("writes a text input's value to its field", () => {
    const setField = vi.fn();
    textFieldHandler(setField, "title")({
      target: { value: "Zalana jezdnia" },
    } as ChangeEvent<HTMLInputElement>);
    expect(setField).toHaveBeenCalledWith("title", "Zalana jezdnia");
  });

  it("writes a checkbox's checked state to its field", () => {
    const setField = vi.fn();
    checkboxFieldHandler(setField, "consent")({
      target: { checked: true },
    } as ChangeEvent<HTMLInputElement>);
    expect(setField).toHaveBeenCalledWith("consent", true);
  });

  it("writes a reported value straight to its field", () => {
    const setField = vi.fn();
    valueFieldHandler(setField, "lat")(54.35);
    expect(setField).toHaveBeenCalledWith("lat", 54.35);
  });
});
