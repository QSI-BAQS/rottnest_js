import { TestDocument } from '../TestDocument';
import { ZoomService, ZoomModuleParent } from '../../src/service/ZoomService';


class MockModuleState implements ZoomModuleParent {

  getModuleStates() {
    return {
      getZoomState: function() {
        return {} as any
      }
    } as any
  }
  
}


TestDocument
  .begin("ZoomService - Zoom Up")
  .description(`Used to test the zoom state module`)
  .toTest((state, input) => {
    const zoom = state.zoom;
    zoom.updateZoomValue(input);
    return zoom.getZoomValue();
  })
  .withState((() => {
    return {
      zoom: new ZoomService(100, new MockModuleState())
    }
  })())
  .withInputs()
    .appendInputs([
      125,
      150,
      175,
      200,
      225,
      250
    ])
  .how()
  .withExpecteds()
    .appendExpecteds([
      125,
      150,
      175,
      200,
      225,
      250 
    ])
  .validate()
  .eval()


