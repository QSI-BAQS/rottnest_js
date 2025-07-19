import { ArchCapabilityQuery, ArchCapabilityResult } from "../../ArchContext";
import { ArchitectureProject, ArchitectureSerializer } from "../../ArchSchema";
import { ProjectDetailsDefaultData } from "../obj/Project";
import { RegionDataList } from "../obj/RegionDataList";


/**
 * SuperconductingSerializer, will serialise the project
 * and deserialize it from a string.
 */
export class SuperconductingSerializer implements ArchitectureSerializer<any> {
  serialize(obj: ArchitectureProject<any>): string {
      return JSON.stringify(obj);
  }

   /**
   * Queries the capabiliteies of the designer
   */
  queryCapability(query: ArchCapabilityQuery): ArchCapabilityResult {
    if(query.capability === 'CanSave') {
      return ArchCapabilityResult.Confirm();
    }
    if(query.capability === 'CanLoad') {
      return ArchCapabilityResult.Confirm();
    }
    return ArchCapabilityResult.Deny();
  }
  
  /**
   * Deserialises the object into a 
   */
  deserialize(data: string): ArchitectureProject<any> {
      return this.parseLoadedFile(data);
  }

  
  /**
   * Given a deserialized file, we need to transform it from
   * a flattened graph to a linked graph within the system
   */
	parseLoadedFile(content: string | null): ArchitectureProject<any> {
		const proj = ProjectDetailsDefaultData();
		if(content) {
			
			const jsonRep: ArchitectureProject<any> = JSON.parse(content);
			//TODO: Check to see if the input is sane
			const fromFlat = RegionDataList.fromFlatten(jsonRep as any);

			/// TODO: Fix up the raw conversion here
			proj.header = jsonRep.header;
			proj.body.object['width'] = jsonRep.body.object['width'];
			proj.body.object['height'] = jsonRep.body.object['height'];
			proj.body.object['regions'] = fromFlat as any;
		}
		return proj;
	}
}
