import type { StyleDefinition, SerializedStyleDefinition } from './types';

export declare function serializeStylesLookup(def: StyleDefinition): SerializedStyleDefinition;
export declare function loadSerializedLookup(def: SerializedStyleDefinition): StyleDefinition;
