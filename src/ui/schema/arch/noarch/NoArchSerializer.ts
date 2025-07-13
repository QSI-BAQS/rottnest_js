import { ArchitectureSerializer } from "../ArchSchema";


/**
 * No ArchDesigner, it is used as a placeholder for when
 * no architecture has been selected
 */
export class NoArchSerializer implements ArchitectureSerializer<any> {

  serialize(_obj: any): string {
    return '';
  }

  deserialize(_data: string): any {
    return {};
  }

}
