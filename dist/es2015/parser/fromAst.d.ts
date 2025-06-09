import { SelectionFilter } from '../types';
import { SingleStyleAst, StyleSelector } from './ast';

export declare const escapeValue: (value: string, name: string) => string;
export declare const fromAst: (rules: string[], def: SingleStyleAst, filter?: SelectionFilter | undefined) => string;
export declare const getUnmatchableRules: (
  def: SingleStyleAst,
  filter?: SelectionFilter | undefined
) => StyleSelector[];
export declare const extractUnmatchable: (def: SingleStyleAst, filter?: SelectionFilter | undefined) => string;
export declare const convertToString: (blocks: StyleSelector[], { bodies }: SingleStyleAst) => string;
