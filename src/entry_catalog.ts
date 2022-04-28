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

  contains( lookup: string ): boolean {
    return this.catalog.has(lookup);
  }

  by( lookup: string ): EntryType {
    return this.catalog.get(lookup);
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
          return {value: this.index[i], done: false}
        } else {
          return {value: null, done: true}
        }
      }
    }
  }

  //public next(): IteratorResult<number> {
};

export default EntryCatalog;
