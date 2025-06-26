// src/tests/setup.js
import '@testing-library/jest-dom'; // Extends Vitest's expect with DOM matchers

// Mock localStorage (this mock will now run in the jsdom environment)
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();
// Now that jsdom is enabled, 'window' will exist.
// Assign our mock to window.localStorage.
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// If you use 'fetch' directly in your tests, you might want to mock it here globally too,
// or use vi.mock() in individual tests.