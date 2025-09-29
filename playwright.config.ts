import { defineConfig, devices } from "@playwright/test";
import type { TestOptions } from "./test-options";

// Load .env variables globally for all tests
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(__dirname, ".env") });

export default defineConfig<TestOptions>({
  timeout: 40 * 1000,
  reporter: [
    ["json", { outputFile: "test-results/test-results.json" }],
    ["junit", { outputFile: "test-results/test-results.xml" }],
    ["html"],
  ],
  use: {
    baseURL:
      process.env.DEV === "1"
        ? "http://localhost:4200/"
        : process.env.STAGING === "1"
        ? "http://uitestingplayground.com/ajax/"
        : "http://localhost:4200/",
    globalsQaURL: "https://www.globalsqa.com/demo-site/draganddrop/",
    trace: "on-first-retry",
    // Pass env variables to all tests
    extraHTTPHeaders: {
      "x-username": process.env.USERNAME || "",
      "x-password": process.env.PASSWORD || "",
    },
  },

  projects: [
    {
      name: "chromium",
    },
    {
      name: "mobile",
      testMatch: "testMobile.spec.ts",
      use: {
        ...devices["iPhone 13 Pro Max"],
      },
    },

    {
      name: "firefox",
      use: { browserName: "firefox", video: { mode: "on" } },
    },
    {
      name: "pageObjectFullScreen",
      testMatch: "usePageObjects.spec.ts",
      use: {
        browserName: "chromium", // 👈 makes it clear
        video: { mode: "on", size: { width: 1920, height: 1080 } },
      },
    },
  ],

  webServer: {
    command: "npm run start",
    url: "http://localhost:4200",
    reuseExistingServer: true,
  },
});
