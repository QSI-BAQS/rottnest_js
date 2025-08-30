

/**
 * Interface/Wrapper around a project assembly
 * that may have an arbitrary internal representation
 */
export interface ValidationProject<T> {
  name(): string

  getObject(): T
}
