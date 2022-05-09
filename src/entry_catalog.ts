import BaseEntryType from './base_entry_type'

export class EntryCatalog<EntryType extends BaseEntryType> implements Iterable<EntryType> {
  
  // // https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
  // type ResourcesByKey = Map<string,ResourceType>;
  // type ResourcesByIndex = ResourceType[];

  catalog: Map<string,EntryType>;
  index: EntryType[];
  
  constructor() {
    this.catalog = new Map<string,EntryType>();
    this.index = [];
  };

  add( entry: EntryType ): void {
    this.catalog.set( entry.key, entry );
    this.index[entry.index] = entry;
  }

  at( lookup: number ): EntryType {
    return this.index[lookup];
  }

  by( lookup: string ): EntryType {
    return this.catalog.get(lookup);
  }

  contains( lookup: string ): boolean {
    return this.catalog.has(lookup);
  }

  link( other: EntryCatalog<any> ): boolean {
    if( (0 == this.size) || (0 == other.size) ){
      return false;
    }

    for( let i = 0; i < this.index.length; i++ ){
      const entry = this.index[i];
      if( ! entry.link(other))
        break;
    }
    return true;
  }

  get size(): number {
    return this.index.length;
  }

  [Symbol.iterator]() : Iterator<EntryType> {
    let i = -1;
    return {
      next: () => {
        i++;
        if (i < this.index.length){
          //console.log(`....Fetching: [${i}]: ${this.index[i]}`);
          return {value: this.index[i], done: false}
        } else {
          //console.log(`....Fetching: [${i}]: null;`);
          return {value: null, done: true}
        }
      }
    }
  }

  //public next(): IteratorResult<number> {
};

export default EntryCatalog;
