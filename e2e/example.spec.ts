import { test, expect } from "@playwright/test";

test.describe("homepage", () => {
  test("loads successfully", async ({ page }) => {
    const res = await page.goto("/");
    expect(res?.status()).toBe(200);
  });
});
