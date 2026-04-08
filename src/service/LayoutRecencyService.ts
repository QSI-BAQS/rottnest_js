/*
 * RecencyEntry is used to provide an entry
 * for the service list and save to local storage
 */
export type LayoutRecencyEntry = {
  name: string,
  key: string,
  data: any
}


/*
 * Used as a way to manage recency of the layouts that are 
 * submitted to the backend. It will also allow for keeping track
 * of the layouts that have been used as of late and the architecture
 * they were selected with
 */
export class LayoutRecencyService {

  // Class properties that would be required to monitor the
  // service instance itself
  static #instance: LayoutRecencyService | null = null;
  static StorageKey = "recencylist";
  static PrefixKey = "rlist:"

  // Serialised mapped attributes - keys to be used
  static #capacityKey = 'capacity';
  static #currentKeyKey = 'current'; //Too funny not to include
  static #layoutsKey = 'layouts';
  static #layoutNamesKey = 'layout_names';

  // Private instances for when it is alive
  #capacity = 10;
  #currentKey = 0;
  #names: { [key: string]: string } = {};

  constructor() {
    // Initialise localstorage entries if it fails to load
    if(!this.#loadfrom()) {
      // Did not load, populate the localstorage with keys
      this.drain();
    }
  }

  //
  // Constructs the entry for the service
  // 
  static ConstructEntry(name: string, data: any): LayoutRecencyEntry {
    const instance = LayoutRecencyService.GetInstance();
    return {
      name,
      data,
      key: instance.nextKey()
    }
  }

  //
  // Gets the instance of the recency service
  // 
  static GetInstance() {
    let instance = LayoutRecencyService.#instance;
    
    if(instance === null) {
      instance = new LayoutRecencyService();
      LayoutRecencyService.#instance = instance;
      instance.#loadfrom();
    }
    return instance;
  }


  //
  // Tries to load from localstorage if possible
  // May result in incomplete data
  // 
  #loadfrom() {
    let didLoad = false;
    const listserialised = localStorage.getItem(LayoutRecencyService.StorageKey)

    if(listserialised) {
      const listdata = JSON.parse(listserialised);

      if(listdata) {
      
        const capacityData = listdata[LayoutRecencyService.#capacityKey]
        const currentKeyData = listdata[LayoutRecencyService.#currentKeyKey];
        
        if(capacityData && currentKeyData) {
          this.#currentKey = currentKeyData;
          this.#capacity = capacityData;
          didLoad = true;
        }
      }
    }
    return didLoad;
  }

  //
  // Resets the key to 0
  //  
  reset() {
    this.#currentKey = 0;
  }

  //
  // Generates the next key between 0 and capacity-1
  // Will cycle through them as to not have infinite amount of memory utilised
  // 
  nextKey() {
    const key = this.#currentKey;
    this.#currentKey = (this.#currentKey + 1) % this.#capacity;
    return `${LayoutRecencyService.PrefixKey}${key}`;
  }

  //
  // Gets the recents list from localstorage
  // This will be flushed and pulled on request
  // 
  getRecents(): { [key: string]: any } {
    let recents = {};
    if(localStorage[LayoutRecencyService.StorageKey] !== null) {
      recents = JSON.parse(localStorage[LayoutRecencyService.StorageKey]).layouts;
      return recents;
    }
    return recents;
  }

  //
  // Gets the list of names and their mapping
  // 
  getNames(): {[key: string]: string } {
    return this.#names
  }

  //
  // Will be used to get a project list on load
  // and provide some decision making process for the user when
  // look into it
  // 
  pushRecent(entry: Partial<LayoutRecencyEntry>) {
    const recents = this.getRecents();
    const nextKey = entry.key ?
      (entry.key.startsWith(LayoutRecencyService.PrefixKey) ? 
        entry.key : this.nextKey()) :
      this.nextKey();
      
    const name = entry.name!;
    console.log(nextKey);
    recents[nextKey] = entry;
    this.#names[name] = nextKey;
    
    this.save(recents);
  }


  //
  // Clears the dictionaries and pushes an empty
  // or templated setup
  // 
  drain() {
    this.#names = {};
    this.#currentKey = 0;
    localStorage[LayoutRecencyService.StorageKey] = JSON.stringify({
      [LayoutRecencyService.#capacityKey] : this.#capacity,
      [LayoutRecencyService.#currentKeyKey] : 0,
      [LayoutRecencyService.#layoutsKey] : {},
      [LayoutRecencyService.#layoutNamesKey] : {}
    });
  }

  //
  // Saves the recents dictionary to the localstorage
  // so it can handle it appropriately
  // 
  save(recents: { [key: string]: any }) {
    
    localStorage[LayoutRecencyService.StorageKey] = JSON.stringify({
      [LayoutRecencyService.#capacityKey] : this.#capacity,
      [LayoutRecencyService.#currentKeyKey] : this.#currentKey,
      [LayoutRecencyService.#layoutNamesKey] : this.#names,
      [LayoutRecencyService.#layoutsKey] : recents
    });
    return true;
  } 
}
