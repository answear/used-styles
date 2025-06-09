import { Transform } from 'stream';

import { CacheLine, StyleDefinition, UsedTypes } from '../types';

export declare const process: (
  chunk: string,
  line: CacheLine,
  def: StyleDefinition,
  callback: (styles: UsedTypes) => void
) => string;
export declare const processPlain: (
  chunk: string,
  line: CacheLine,
  def: StyleDefinition,
  callback: (styles: UsedTypes) => void
) => string;
export declare const processReact: (
  chunk: string,
  _line: CacheLine,
  def: StyleDefinition,
  callback: (styles: UsedTypes) => void
) => string;
export declare const createStyleStream: (
  def: StyleDefinition,
  callback: (styleFile: string) => string | undefined | void
) => Transform;
