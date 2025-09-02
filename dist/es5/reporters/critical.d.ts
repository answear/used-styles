import { Transform } from 'stream';

import { CacheLine, StyleDefinition } from '../types';

export declare const process: (chunk: string, line: CacheLine, callback: (styles: string) => void) => string;
export declare const processPlain: (chunk: string, line: CacheLine, callback: (styles: string) => void) => string;
export declare const processReact: (chunk: string, _line: CacheLine, callback: (styles: string) => void) => string;
export declare const createCriticalStyleStream: (def: StyleDefinition) => Transform;
