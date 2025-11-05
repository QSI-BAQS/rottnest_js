import { ProtocolState, ProtocolStateChainBuilder, ProtocolStateSet } from './protocolstate';

export class ProtocolTestRunner {

  websocket: WebSocket;
  stateset: ProtocolStateSet;
  currentState: ProtocolState;

  constructor(websocket: WebSocket, stateset: ProtocolStateSet) {

    this.currentState = stateset.initial;
    this.websocket = websocket;
    this.stateset = stateset;

    const self = this;
    websocket.onopen = function(event: Event) {};

    websocket.onmessage = function(event: MessageEvent) {
      const data = event.data;
      const nextState = self.currentState.onMessage(self.stateset.states, data);
      self.currentState = nextState as ProtocolState;

    };

    websocket.onclose = function(event: CloseEvent) {
      // What to do on close
    };
  }


  onMessage() {
    
  }

  

  
  
}


