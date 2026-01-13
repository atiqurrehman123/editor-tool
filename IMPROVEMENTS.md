# Project Improvement Recommendations

This document outlines recommended improvements for the `plaquita-client` project to enhance maintainability, performance, and scalability.

## 1. Component De-composition & Architecture

### **Problem:** Monolithic `DesignEditor.jsx`
The `DesignEditor.jsx` file is approximately **4,700 lines long**. It currently handles:
-   UI Rendering (Toolbar, Canvas area, Dialogs)
-   Canvas Logic (Fabric.js initialization, object manipulation, event handling)
-   Business Logic (Pricing, API calls)
-   State Management (dozens of `useState` hooks)

### **Recommendation:**
Refactor `DesignEditor` into smaller, focused components and hooks:
-   **`useFabricCanvas` Hook**: Extract all Fabric.js initialization and event listeners into a custom hook. This separates the "canvas engine" from the UI.
-   **Sub-components**: Split the UI into distinct files:
    -   `DesignCanvas.jsx`: Pure wrapper for the canvas element.
    -   `DesignToolbar.jsx`: The top or side toolbar.
    -   `PropertiesPanel.jsx`: The context-aware right panel (currently mixed in `SideMenu` and `DesignEditor`).
-   **Logic Extraction**: Move `fetchProducts`, `handleObjectScaling`, and `createPNGImgObjectFromText` into separate utility modules or hooks.

## 2. State Management

### **Problem:** Prop Drilling
`SideMenu.jsx` receives a massive list of props (30+) to control the UI and update state in `DesignEditor`. This makes the code fragile and hard to extend.

### **Recommendation:**
-   **React Context**: Create a `DesignContext` to hold the shared state (active selection, text options, current view, etc.). `SideMenu` and `DesignEditor` can consume this context directly, eliminating prop drilling.
-   **Reducer Pattern**: Use `useReducer` for complex state logic (e.g., undo/redo history, canvas object updates) instead of scattered `useState` calls.

## 3. Code Quality & Duplication

### **Problem:** Repetitive Code
-   Methods like `handleObjectScaling` and `handleObjectScaling1` appear to have significant duplicated logic.
-   Canvas setup code is repeated for different views (Front/Back/Left/Right).

### **Recommendation:**
-   **Unify Handlers**: refactor similar event handlers into a single parameterized function.
-   **Configuration Driven**: Use configuration objects to define the behavior for different views instead of hardcoding `switch` statements or repeated logic blocks.

## 4. Performance Optimization

### **Problem:** Heavy Re-renders
With all state in the top-level `DesignEditor`, every keystroke in a text input or color change potentially re-renders the entire editor, including the heavy canvas wrapper.

### **Recommendation:**
-   **Memoization**: Use `React.memo` for pure UI components (`SideMenu` buttons, icon lists).
-   **Debouncing**: Debounce canvas updates when typing text or dragging sliders to prevent freezing the UI.
-   **Lazy Loading**: Load heavy assets or dialogs (`BulkuploadDialog`, etc.) only when needed using `React.lazy`.

## 5. Styling Consistency

### **Problem:** Mixed Styling Approaches
The project uses:
-   Inline styles (found in `DesignEditor.jsx`)
-   Styled Components (`Styles.jsx`)
-   Tailwind CSS (recently configured)

### **Recommendation:**
-   **Standardize**: Adopt Tailwind CSS as the primary styling engine for layout and spacing. Use `styled-components` only for dynamic, prop-driven styles if necessary, or just use Tailwind's `clsx`/`classnames` pattern.
-   **Remove Inline Styles**: Extract inline styles into CSS classes to improve readability and performance.

## 6. Build & Tooling

### **Problem:** Configuration Gaps
-   Missing PostCSS/Tailwind config (Fixes applied).
-   "process/browser" polyfill issues (Fixes applied).

### **Recommendation:**
-   **Linting**: Add `eslint-plugin-react-hooks` and `prettier` to enforce code style and catch bugs (e.g., missing dependencies in `useEffect`).
-   **Type Safety**: Consider gradually migrating critical files (like data models and utility functions) to **TypeScript**. This would prevent many runtime errors related to canvas objects and API responses.

## 7. Testing Strategy

### **Problem:** Lack of Tests
There are currently no significant unit or integration tests for the complex editor logic.

### **Recommendation:**
-   **Unit Tests**: Test utility functions in `src/common` (e.g., `extractColors`).
-   **Component Tests**: Use React Testing Library to test that the `SideMenu` renders correctly and fires events.
-   **Visual Tests**: Since this is a visual tool, manual verification or screenshot testing is crucial, but basic smoke tests can ensure the canvas loads without crashing.

---

### Suggested First Steps
1.  **Extract `useCanvas` hook**: Move direct fabric.js calls out of the main component.
2.  **Context Implementation**: Introduce `DesignContext` to clean up `SideMenu` props.
3.  **Linting Setup**: Fix all lint warnings to ensure a clean slate.
