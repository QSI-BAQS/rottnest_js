import { TestDocument } from '../TestDocument';
import { ZoomService } from '../../src/service/ZoomService';



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
      zoom: new ZoomService(100)
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


