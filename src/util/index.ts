import { Null as nullobject } from './Null.ts'
import { Style as style } from './Style.ts'
import { Web } from './FileDownload.ts';

/**
  * Utility object that holds methods/functions inside it
  * that can be used in other locations as a more general form
  */
export namespace Util {
  
  export const Style = style;
  export const Null = nullobject;
  export type Empty = {};

  export const FileIO = {
    Web,
  }
      
};

