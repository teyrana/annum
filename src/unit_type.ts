import BaseEntryType from './base_entry_type'
import StorageType from './storage_type'
import SensorType from './sensor_type'
import TagSet from './tag_set'


class UnitType implements BaseEntryType {
  readonly typeName: string = 'UnitType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';

  readonly platform: string = '<missing>';
  // map of module names => quantity
  readonly modules = new Map<string,number>();

  // all of these are synthetic values, calculated from the child platform & modules
  // readonly ammo = []
  // readonly sensor = SensorType.VISUAL;
  // readonly module: ???? 
  // readonly weapon = None
  readonly mass: number = 1000.0;  // units = kilograms
  readonly volume: number = 1.0;  // units == L (liters, litres)

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet()

  copy( entryIndex:number, doc: any, catalog ) : UnitType {
    return new UnitType( entryIndex, this, doc, catalog );
  }

  constructor( entryIndex: number = -1, archetype: UnitType = null, doc: any = null, catalog=null ){
    this.index = entryIndex;

    if( (archetype === null) || (doc === null) ){
      return;
    }

    // override defaults with pattern values
    this.description = archetype.description;
    this.mass = archetype.mass;
    this.volume = archetype.volume;
    this.tags.update(archetype.tags);

    for( const [key,value] of Object.entries(doc)){
      if('key' === key){
        this.key = doc.key;
      }else if('description'.startsWith(key)){
        this.description = <string>value;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('modules'.startsWith(key)){
        for( const [key,qty] of Object.entries(value) ){
          this.modules.set(key,<number>qty);
        };
      }else if('name' === key){
        this.name = doc.name;

      }else if('platform'.startsWith(key)){
        this.platform = <string>value

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

  link( masterCatalog: any): boolean {
    const processCatalog = masterCatalog.processCatalog;

    this.modules.forEach( key => {
      const found = processCatalog.contains(key);
      if( ! found){
        console.log(`    !!!! @<${this.typeName}>: ${this.key.padEnd(32)}  ... could not find process: ${key}`)
        return false;
      }
    });


    return true;
  }

  str() : string {
    let str = `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"`;
    if( this.superKey ){
      str += `\n              :^:${this.superKey}`;
    }

    if( 0 < this.modules.size ){
      str += '              :: Modules: ';
      this.modules.forEach( (qty,key) => {
        const pad = 20;
        str += `                  - ${key.padEnd(pad,'.')}`
             + ` ${(0<qty)?' ':''} ${qty}\n`;
      });
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

export default UnitType;
