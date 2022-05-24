import BaseEntryType from './base_entry_type'

export class EntryTable<EntryType extends BaseEntryType> implements Iterable<EntryType> {
  
  // // https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
  // type ResourcesByKey = Map<string,ResourceType>;
  // type ResourcesByIndex = ResourceType[];

  map: Map<string,EntryType>;
  index: EntryType[];
  
  constructor() {
    this.map = new Map<string,EntryType>();
    this.index = [];
  };

  add( entry: EntryType ): void {
    this.map.set( entry.key, entry );
    this.index[entry.index] = entry;
  }

  at( lookup: number ): EntryType {
    return this.index[lookup];
  }

  get( lookup: string ): EntryType {
    return this.map.get(lookup);
  }

  contains( lookup: string ): boolean {
    return this.map.has(lookup);
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

export default EntryTable;
