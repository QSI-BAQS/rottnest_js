

/**
 * DeadzoneTuple that is used to
 * keep track of the elements, the event to deregister will need
 * to be produced along side this
 */
export class DeadzoneTuple {

  elementInUse: any;
  deadzones: Array<any> = [];
  //inUseEvent: (data: any) => void;
  
  constructor(elementInUse: any, deadzones: Array<any>) {
    this.elementInUse = elementInUse;
    this.deadzones = deadzones;
  }
  
}


/**
 * DeadzoneService is used to construct events to disable
 * inputs and reset states of elements
 *
 * When constructed with a DeadzoneTuple, it will also be registed with the event
 *
 */
export class DeadzoneService {

  trackedTuples: Array<any> = [];

  constructor() {}


  
}
