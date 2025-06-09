export interface LocalCodeLocation {
  line: number;
  column: number;
}
export declare type CodeLocation = LocalCodeLocation;
export interface CodeLocationRange {
  start: CodeLocation;
  end: CodeLocation;
}
export declare const rangesEqual: (a: CodeLocation, b: CodeLocation) => boolean;
export declare const rangesIntervalEqual: (a: CodeLocationRange, b: CodeLocationRange) => boolean;
export declare const localRangeMin: (v: CodeLocation, max: LocalCodeLocation) => CodeLocation;
export declare const localRangeMax: (v: CodeLocation, min: LocalCodeLocation) => CodeLocation;
export declare const createRange: (line: number, column: number) => CodeLocation;
