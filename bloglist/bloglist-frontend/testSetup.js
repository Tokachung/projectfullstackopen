import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// This file ensures that after each vitest test is run, the cleanup function executes to reset jsdom which simulates the browser
// We need to update vite.config.js to use this

afterEach(() => {
  cleanup();
});
