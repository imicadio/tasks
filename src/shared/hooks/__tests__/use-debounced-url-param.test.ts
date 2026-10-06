import { act, renderHook } from "@testing-library/react";
import type { ChangeEvent } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDebouncedUrlParam } from "../use-debounced-url-param";

const replace = vi.fn();
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/hydrologia",
  useRouter: () => ({ replace }),
}));

describe("useDebouncedUrlParam", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    replace.mockClear();
  });

  it("updates the input immediately and the URL after the delay", () => {
    const { result } = renderHook(() => useDebouncedUrlParam("q", "", 300));

    act(() =>
      result.current.handleInputChange({
        target: { value: "wisła" },
      } as ChangeEvent<HTMLInputElement>),
    );
    expect(result.current.input).toBe("wisła");
    expect(replace).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(300));
    expect(replace).toHaveBeenCalledTimes(1);
    expect(String(replace.mock.calls[0][0])).toContain("q=wis%C5%82a");
  });
});
