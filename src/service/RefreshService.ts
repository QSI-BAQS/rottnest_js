
/**
 * This is a stand in object to
 * outline that the refresh trigger has not been implemented
 */
class NoRefreshImpl implements UpdateTrigger {
  triggerUpdate(): void {
    console.log("triggerUpdate correspond to NoRefresh action")
  }
}

/**
 * Interface that guarantees that the
 * container has some idea of triggering an update
 * for the container
 */
export interface UpdateTrigger {
  triggerUpdate(): void;
  
}

/**
 * RefreshService provides an object that
 * will latch onto anything that is updatable
 * and allow the users to trigger such an update
 */
export class RefreshService {

  updateObject: UpdateTrigger;

  /**
   * A static method that will provide a no-op
   * variant
   */
  static NoRefresh(): RefreshService {
    return new RefreshService(new NoRefreshImpl());
  }

  /**
   * COnstructing a new object, this is
   * passing a trigger function to it
   */
  constructor(trig: UpdateTrigger) {
    this.updateObject = trig;
  }

  /**
   * Will trigger an update on the container
   * This is target the application/main container but
   * can be used in other components
   */
  triggerRefresh() {
    this.updateObject.triggerUpdate();
  }
  
}
