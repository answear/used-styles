/**
 * moves dynamically injected styles outside of rendered content to the document head to avoid hydration mismatch
 * @see {@link removeStyles} as a followup when all required styles are loaded as files
 */
export declare const moveStyles: () => void;
/**
 * removes dynamically injected styles to avoid hydration mismatch
 * @see {@link moveStyles} to only move styles and avoid "flash of unstyled content"
 */
export declare const removeStyles: () => void;
