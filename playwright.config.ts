import { defineConfig } from "@playwright/test";

const port = process.env.PLAYWRIGHT_PORT ?? "3000";
const viewportWidth = Number(process.env.PLAYWRIGHT_VIEWPORT_WIDTH ?? "1920");
const viewportHeight = Number(process.env.PLAYWRIGHT_VIEWPORT_HEIGHT ?? "1080");

export default defineConfig({
  testDir: "./e2e",
  timeout: 45_000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: `http://localhost:${port}`,
    channel: "chromium",
    viewport: { width: viewportWidth, height: viewportHeight },
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run dev -- -p ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
