
/**
 * Provies a simple type that is the parameters of the event listener
 */
export type InputHookParams = Parameters<typeof document.addEventListener>;

/**
 * The input hook service will allow for developers to
 * register callbacks on document level events
 * This is to ensure that the contexts aren't reaching beyond
 * what they should
 */
export class InputHookService {
  registeredHooks: Map<string, InputHookParams> = new Map();

  /**
   * Uses the addEventLIstener params as a parameter for the input
   * Abstracts the global input hooks through the service and allows controlling of dropping
   * them all as they are registered via a map.
   */
  registerHook(params: InputHookParams): boolean {
    const name = params[0];
    this.registeredHooks.set(name, params);
    document.addEventListener(...params);
    
    return false;
  }

  /**
   * Removes the hook from the registered hooks
   * also checks to see if it was also removed the event listeners.
   */
  removeHook(hookname: string) : boolean {
    if(this.registeredHooks.has(hookname)) {
      const hookVal = this.registeredHooks.get(hookname);
      this.registeredHooks.delete(hookname);
      if(hookVal) {
        document.removeEventListener(...hookVal);
        return true;
      }
    }
    return false;
  }
}

