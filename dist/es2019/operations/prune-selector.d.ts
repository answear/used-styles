import { SingleStyleAst } from '../parser/ast';

export declare const pruneSelector: (
  ast: Readonly<SingleStyleAst>,
  filter: (name: string) => boolean
) => Readonly<SingleStyleAst>;
