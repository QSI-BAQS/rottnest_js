import { ArchCapabilityQuery, ArchCapabilityResult } from "../../ArchContext";
import { ArchitectureProject, ArchitectureSerializer } from "../../ArchSchema";
import { ProjectDetailsDefaultData } from "../obj/Project";


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
		if(content) {
			const jsonRep = JSON.parse(content);
			return jsonRep;
		} else {
			return ProjectDetailsDefaultData();
		}
			/*
			if(jsonRep) {
				const dump: ProjectDump = jsonRep;
				if(dump) {
					const regionList = RegionDataList.fromFlatten(dump.body.object.regions);

					//TODO: Fix this
					const newState = {...this.state};
					//const dspace = this.monitorComponent.designSpace;
					//TODO: Trigger a re-run of the cells once loaded
					// 
					//if(dspace) {
					// 	dspace.redoCells(newState.projectDetails.width,
					// 	  newState.projectDetails.height);
					// }
					//TODO: Fix this
					this.setState(newState);
				}
				//this.triggerUpdate();
			}*/
			
		}
	}
}
