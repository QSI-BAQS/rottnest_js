import { noop } from "./Noop";


/**
  * Specifies an object that is empty
  * and has no fields or anything else that is interesting
  */
const empty = {};

/**
  * Exports utility operations that
  * are for nulls, noops and nothings
  */
export const Null = {
  noop,
  empty,
};
