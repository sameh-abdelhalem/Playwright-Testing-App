import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig<TestOptions>({
  timeout: 40 * 1000,
  globalTimeout: 60 * 1000,
  retries: 1,
  reporter: "html",
  use: {
    baseURL:
      process.env.DEV === "1"
        ? "http://localhost:4200/"
        : process.env.STAGING === "1"
        ? "http://uitestingplayground.com/ajax/"
        : "http://localhost:4200/",
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "dev",
      use: { ...devices["Desktop Chrome"], baseURL: "http://localhost:4200/" },
    },
    {
      name: "chromium",
      timeout: 60 * 1000,
    },

    {
      name: "firefox",
      use: { browserName: "firefox", video: { mode: "on" } },
    },
    {
      name: "pageObjectFullScreen",
      testMatch: "usePageObjects.spec.ts",
      use: {
        video: { mode: "on", size: { width: 1920, height: 1080 } },
      },
    },
  ],
});
