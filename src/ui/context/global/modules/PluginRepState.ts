

/**
 * PluginRepresentationState,
 * Needed to maintain the current state of the
 * arch and program plugin ui states
 */
export class PluginRepresetationState {

  archShown: boolean = false
  programShown: boolean = false;

  /**
   * Gets the states of the plugins ui boxes
   */
  getStates(): [boolean, boolean] {
    return [ this.archShown, this.programShown ];
  }

  /**
   * Sets the states to ensure they show
   * the components based on the values given
   */
  setStates(arch: boolean, prog: boolean) {
    this.archShown = arch;
    this.programShown = prog;
  }

  /**
   * Provides a setter that can be used by different
   * components
   */
  getCallback() {
    const ref = this;
    return (a: boolean, p: boolean) => ref.setStates(a, p);
  }
  
}
