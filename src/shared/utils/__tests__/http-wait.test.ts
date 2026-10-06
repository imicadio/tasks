import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { badRequest } from "../http";
import { wait } from "../wait";

describe("badRequest", () => {
  it("returns 400 with the flattened zod error", async () => {
    const parsed = z.object({ page: z.number() }).safeParse({ page: "x" });
    if (parsed.success) throw new Error("expected a validation error");

    const response = badRequest(parsed.error);

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error.fieldErrors.page).toHaveLength(1);
  });
});

describe("wait", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after the given delay", async () => {
    vi.useFakeTimers();
    const done = vi.fn();
    void wait(500).then(done);

    await vi.advanceTimersByTimeAsync(499);
    expect(done).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toHaveBeenCalled();
  });
});
