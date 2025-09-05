import RottnestApplication from "../container/RottnestApplication";
import { hiddenInputProc } from "./Load";

/**
 * Creates a hidden load component to ensure it gets
 * sized correctly and has a good workaround for all browsers
 */
export function LoadComponent({ rott }: {rott: RottnestApplication}) {
  return (
    <input style={{ opacity: 0, width: "100%", position: "absolute",
      height: "inherit" }}
			type="file" 
			onChange={(e) => {
			  hiddenInputProc(e, rott)
			  hiddenInputProc(e, rott) //TODO: Remove this, should be unnecessary
			  //e.preventDefault();
			}} />
	);

}
