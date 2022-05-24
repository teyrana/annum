import BaseEntryType from './base_entry_type'
import StorageType from './storage_type'
import TagSet from './tag_set'
import Units from './units'

class ResourceType implements BaseEntryType {
  readonly typeName: string = 'ResourceType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly units: Units = Units.KG_MASS;
  readonly mass: number = 1000.0;  // units = kilograms
  readonly volume: number = 1.0;  // units == L (liters, litres)
  readonly store: StorageType  = StorageType.DISCRETE;
  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet()

  copy( entryIndex:number, doc: any, catalog ) : ResourceType {
    return new ResourceType( entryIndex, this, doc, catalog );
  }

  constructor( entryIndex: number = -1, archetype: ResourceType = null, doc: any = null, catalog = null ){
    this.index = entryIndex;

    if( (archetype === null) || (doc === null) ){
      return;
    }

    // override defaults with pattern values
    this.description = archetype.description;
    this.units = archetype.units;
    this.mass = archetype.mass;
    this.volume = archetype.volume;
    this.tags.update(archetype.tags);

    for( const [key,value] of Object.entries(doc)){
      if('key' === key){
        this.key = doc.key;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('name' === key){
        this.name = doc.name;
      }else if( 'units' === key ){
        this.units = Units.parseUnitCode(<string>value);
      }else if('density' === key){
        if( doc['units'] ){
          this.units = Units.parseUnitCode(<string>doc['units']);
        }
        const density = doc['density']
        if( Units.KG_MASS === this.units){
          this.mass = 1000.0;
          this.volume = 1.0 / density;
        }else if( Units.L_VOLUME === this.units){
          this.mass = density;
          this.volume = 1.0;
        }
      }else if('mass' === key){
        this.mass = doc.mass;
      }else if('volume'.startsWith(key)){
        this.volume = doc.volume;
      }else if('description'.startsWith(key)){
        this.description = <string>value;
      }else if(('store' === key) || ('storage' === key)){
        this.store = StorageType.parse(<string>value);
      }else if('super' === key){
        this.superKey = doc['super'];
      }else if(key.startsWith('tag')){

        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
        return;
      }
    }

    // no linking needed
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

  valid(): boolean {
    return true;
  }

}

export default ResourceType;
