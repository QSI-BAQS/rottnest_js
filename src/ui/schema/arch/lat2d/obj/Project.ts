import { ArchitectureProject } from '../../ArchSchema.ts'
import { RegionData } from './LatticeRegionData.ts'
import { FlatRegions, FlatRegionsDefaults } from './RegionDataList.ts'


/**
 * Project Details,
 * contains simple information about the project/architecture
 * This will be used by the settings form/project setup
 */
export type ProjectDetails = {
	header: {
		name: string
		version: string,
		architecture: string
		author: string
		description: string
	},
	body: {
		object: {
			regions: FlatRegions
			width: number
			height: number
		}
	},
	getProject(): ArchitectureProject<any>,
	makeDefault(): ArchitectureProject<any>
}

/**
 * Default function for initialising data for the project
 */
export function ProjectDetailsDefaultData(): ProjectDump {
	return {
    header: {
      name: 'Untitled',
      architecture: 'lat2d',
      author: 'you',
      version: '0.1',
      description: 'Your design'
    },
    body: {
      object: {
        regions:FlatRegionsDefaults(),
        width: 20,
        height: 20,
      }
    },
    getProject(): ArchitectureProject<any> {
  	  return this;
  	},
  	makeDefault(): ArchitectureProject<any> {
      return ProjectDetailsDefaultData();
    }
  }
}



/**
 * Aggregate between project details
 * and region list
 */
export type ProjectAssembly<T> = {
	projectDetails: ProjectDetails
	regionList: T
}

/**
 * Tags the region with a string (likely kind)
 * and associates it with a RegionData object
 */
export type TaggedRegionData = {
	tag: string
	regionData: RegionData
}

/**
 * Project details with flat regions,
 * currently used for saving to file
 */
export type ProjectDump = ProjectDetails;

