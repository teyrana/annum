import TagSet from './tag_set'

interface BaseEntryType {
  readonly typeName: string;
  
  readonly description: string;
  readonly name: string;
  readonly index: number;
  readonly key: Lowercase<string>;
  readonly tags?: TagSet;

  copy( i:number, doc:any ): any;
  str(): string;

}

export default BaseEntryType;
