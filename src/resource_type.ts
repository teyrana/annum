import BaseEntryType from './base_entry_type'
import TagSet from './tag_set'

class ResourceType implements BaseEntryType {
  readonly typeName: string = 'ResourceType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly units: string = 'kg';
  readonly mass: number = 1000.0;  // units = kilograms
  readonly volume: number = 1.0;  // units == L (liters, litres)

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet()

  copy( entryIndex:number, doc: any ) : ResourceType {
    // add defaults, if not present
    if( doc.desc === 'undefined' ){
      doc['desc'] = this.description;
    }
    if( doc.units === 'undefined' ){
      doc['units'] = this.units;
    }
    if( doc.mass === 'undefined' ){
      doc['mass'] = this.mass;
    }
    if( doc.volume === 'undefined' ){
      doc['vol'] == this.volume;
    }

    let other = new ResourceType( entryIndex, doc );

    other.tags.update(this.tags);

    return other;
  }

  constructor( entryIndex: number = -1, doc: any = null ){
    this.index = entryIndex;

    if( doc === null ){
      return;
    }

    for( const [key,value] of Object.entries(doc)){
      if('key' === key){
        this.key = doc.key;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('name' === key){
        this.name = doc.name;
      }else if( 'units' === key ){
        this.units = doc['units'];
      }else if('density' === key){
        this.units = doc['units'] || this.units;
        const density = doc['density']
        if( 'kg' === this.units){
          this.mass = 1000.0;
          this.volume = 1.0 / density;
        }else if('L' === this.units){
          this.mass = density;
          this.volume = 1.0;
        }
      }else if('mass' === key){
        this.mass = doc.mass;
      }else if('volume'.startsWith(key)){
        this.volume = doc.volume;
      }else if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if('super' === key){
        this.superKey = doc['super'];
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
        return;
      }
    }
  }

  link(other:any): boolean {
    return true;
  }

  str() : string {
    let str = `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"`;
    if( this.superKey ){
      str += `\n              :^:${this.superKey}`;
    }
    if( this.tags ){
      str += `\n              :[${this.tags}]`;
    }

    return str;
  }

}

export default ResourceType;
