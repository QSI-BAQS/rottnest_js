

/**
 * An action tracker is to keep track of actions
 * that the user has performed and be able to perform an undo and redo
 * of the work
 */
export interface ArchActionTracker<T=any> {

  // When an action occurs, it will track it
  action(obj: T): void;

  // When a redo occurs, it will need to place an element back
  // into the list but return the next one or null
  redo(obj: T): T | null;

  // When an undo occurs, it needs to remove an action that has
  // happened but preserve it in the redo list
  undo(obj: T): T | null;
  
}
