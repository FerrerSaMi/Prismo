import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  testIgnore: process.env.PRISMO_LIVE_TESTS === '1' ? undefined : '**/live-*.spec.ts',
  use: { baseURL: 'http://127.0.0.1:4175', browserName: 'chromium' },
  webServer: { command: 'npm run dev -- --host 127.0.0.1 --port 4175 --strictPort', url: 'http://127.0.0.1:4175', reuseExistingServer: false, timeout: 30_000 },
})
