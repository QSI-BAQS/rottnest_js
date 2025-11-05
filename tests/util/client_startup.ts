
import { ProtocolStateChainBuilder } from './protocolstate';
import { expect } from 'vitest';

const wsURL = 'http://localhost:5132/ws';

const websocket = new WebSocket(wsURL);

//
// arch_list_send - Sends it to server
// arch_list_recv - Waits to receive it from the server
// null - We have finished
// 
ProtocolStateChainBuilder
  .start(websocket)
  .makeAction()
  .setName("arch_list_send")
  .setActionFnWithNext((currentIndex: number) => {
    return (state, _data) => {
      const websocket = state.getWebSocket();

      const pkg = {
        message: 'arch_list',
        payload: {}
      }
      
      websocket.send(JSON.stringify(pkg));
      
      return {
        kind: 'index',
        state: currentIndex+1,
        isvalid: true
      }
    }
  })
  .next()
  .makeReceiver()
  .setName("arch_list_recv")
  .setResponseFnWithNext((currentIndex: number) => {
    return (state, data) => {
      const websocket = state.getWebSocket();
      const messageKind = data['message'];
      const payload = data['payload'];

      if(messageKind === 'arch_list') {
        // Quick 
        expect(payload.length).toBeGreaterThanOrEqual(1);
      } else {
        console.warn("Incorrect message kind given")
      }
      
      websocket.close();

      return {
        kind: 'index',
        state: currentIndex+1,
        isvalid: messageKind === 'arch_list'
      }
    }
  })
  .setConstraintFn((nextState, data) => {
    const messageKind = data['message'];
    return nextState === null
      && messageKind === 'arch_list';
  })
  .finish();
