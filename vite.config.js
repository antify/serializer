import {defineConfig} from "vitest/dist/config";

export default defineConfig(() => {
  return {
    test: {
      env: {
        TZ: 'UTC'
      }
    }
  }
})
