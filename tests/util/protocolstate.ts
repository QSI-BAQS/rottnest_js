

export type ProtocolResponseKind = "object" | "index";

export type ProtocolStateReturn =  ProtocolState | number | null;

export type ProtocolHandlerReturn = {
  kind: ProtocolResponseKind,
  state: ProtocolState | number | null,
  isvalid: boolean
}

export type ProtocolResponseHandler =
  (state: ProtocolState, data: any) => ProtocolHandlerReturn;

export type ProtocolResponseHandlerHelper =
  (currentIndex: number) => ProtocolResponseHandler;

export type ProtocolCheck = (nextState: ProtocolState, data: any) => boolean;

export type ProtocolActionHandler = (state: ProtocolState, data: any) => ProtocolHandlerReturn;
export type ProtocolActionHandlerHelper = (currentIndex: number) => ProtocolActionHandler;

export class ProtocolState {

  stateName: string
  response: ProtocolResponseHandler;
  action: ProtocolActionHandler;
  constraint: ProtocolCheck;
  websocket: WebSocket;

  constructor(name: string, response: ProtocolResponseHandler, action: ProtocolActionHandler,
    constraint: ProtocolCheck, websocket: WebSocket) {
    this.stateName = name;
    this.response = response;
    this.constraint = constraint;
    this.websocket = websocket;
    this.action = action;
  }
  

  static default(websocket: WebSocket) {
    return new ProtocolState(
      "",
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_) => { return false }, websocket
    );
  }

  getWebSocket() {
    return this.websocket;
  }

  setName(name: string) {
    this.stateName = name;
  }

  getName() {
    return this.stateName;
  }

  setConstraint(constraint: ProtocolCheck) {
    this.constraint = constraint;
  }

  getConstraint() {
    return this.constraint;
  }

  setResponseHandler(response: ProtocolResponseHandler) {
    this.response = response;
  }

  getResponseHandler() {
    return this.response;
  }

  onAction(_action: ProtocolActionHandler): ProtocolStateReturn {
    return this;
  }

  onMessage(_allStates: Array<ProtocolState>, _data: any): ProtocolStateReturn {
    throw new Error("Calling on message on non-receiver state")
  }

  duplicate(): ProtocolState {
    throw new Error("Calling duplicate on abstract-type")
  }
  
}

export class ProtocolStateReceiver extends ProtocolState {
  
  constructor(name: string, response: ProtocolResponseHandler,
    action: ProtocolActionHandler,
    constraint: ProtocolCheck, websocket: WebSocket) {
    super(name, response, action, constraint, websocket);
  }

  static default(websocket: WebSocket) {
    return new ProtocolStateReceiver(
      "",
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_) => { return false }, websocket
    );
  }

  onMessage(allStates: Array<ProtocolState>, data: any) {
    let nextState: ProtocolState | number | null = null;
    const {kind, state, isvalid } = this.response(this, data);

    if(isvalid) {

      if(kind === 'index') {
        nextState = allStates[state as number];
      } else if(kind === 'object') {
        nextState = state as ProtocolState;
      }
      if(this.constraint(nextState!, data)) {
        return nextState;
      }
      
    }
    return null;
  }

  duplicate() {
    const dup = new ProtocolStateReceiver(this.stateName, this.response, this.action,
      this.constraint,
      this.websocket);
    return dup;
  }

}


export class ProtocolStateAction extends ProtocolState {
  
  static default(websocket: WebSocket) {
    return new ProtocolStateAction(
      "",
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_, _d) => {
        return {
          kind: "object",
          state: null,
          isvalid: false
        }
      },
      (_) => { return false }, websocket
    );
  }

  duplicate() {
    const dup = new ProtocolStateReceiver(this.stateName, this.response, this.action,
      this.constraint,
      this.websocket);
    return dup;
  }
}

//
// StateMaker, acts as a transition object
// that will allow movement between different objects
// 
type ProtocolStateMaker = {
  makeAction: () => ProtocolStateChainBuilder
  makeReceiver: () => ProtocolStateChainBuilder
}

// 
// Initial state set
// 
export type ProtocolStateSet = {
  initial: ProtocolState,
  states: Array<ProtocolState>
}

//
// Chain builder
// Allows for the construction of the test case that
// can be injected into the running state machine
// 
export class ProtocolStateChainBuilder {

  websocket: WebSocket;
  currentState: ProtocolState;
  allStates: Array<ProtocolState> = [];
  chainChoice: () => ProtocolStateMaker;

  static start(websocket: WebSocket): ProtocolStateMaker {

    const chain = new ProtocolStateChainBuilder(websocket);
    const maker = function() {
      return {
        makeAction: function() {
          const newState = ProtocolStateAction.default(websocket);
          chain.currentState = newState;
          return chain;
        },
        makeReceiver: function() {
          const newState = ProtocolStateReceiver.default(websocket);
          chain.currentState = newState;
          return chain;
        }
        
      }
    }
    chain.chainChoice = maker;
    return maker();
    
  }

  constructor(websocket: WebSocket) {
    this.websocket = websocket;
    this.currentState = ProtocolState.default(this.websocket);
  }

  setResponseFn(response: ProtocolResponseHandler) {
    this.currentState.setResponseHandler(response);
    return this;
  }

  setResponseFnWithNext(responseHelper: ProtocolResponseHandlerHelper) {
    const currentPos = this.allStates.length;
    this.currentState.setResponseHandler(responseHelper(currentPos));
    return this;
  }

  
  setActionFnWithNext(responseHelper: ProtocolActionHandlerHelper) {
    const currentPos = this.allStates.length;
    this.currentState.setResponseHandler(responseHelper(currentPos));
    return this;
  }

  setConstraintFn(constraint: ProtocolCheck) {
    this.currentState.setConstraint(constraint);
    return this;
  }

  setName(name: string) {
    this.currentState.setName(name);
    return this;
  }
  
  inherit() {
    this.allStates.push(this.currentState);
    this.currentState = this.currentState.duplicate();
    return this;
  }

  next() {
    this.allStates.push(this.currentState);
    return this.chainChoice();
  }

  nextReceiver() {
    this.allStates.push(this.currentState);
    this.currentState = ProtocolStateReceiver.default(this.websocket);
    return this;
  }

  nextAction() {
    this.allStates.push(this.currentState);
    this.currentState = ProtocolStateAction.default(this.websocket);
    return this;
  }

  finish(): ProtocolStateSet {
    this.allStates.push(this.currentState);
    return {
      initial: this.allStates[0],
      states: this.allStates,
    }
  }
}
