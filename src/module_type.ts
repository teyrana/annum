import BaseEntryType from './base_entry_type'
import Cost from './cost'
import StorageType from './storage_type'
import TagSet from './tag_set'
import ProcessType from './process_type'

class ModuleType implements BaseEntryType {
  readonly typeName: string = 'ModuleType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';

  // mass and storage of the module _itself_
  readonly mass: number = 1000.0;  // units = kilograms
  readonly volume: number = 1000.0;  // units == L (liters, litres)

  // really process -> quantity
  readonly process = new Set<string>();

  readonly mount: string = 'internal';

  // really resource -> quantity
  // quantity / mass / resource of the _contained_ resource
  readonly store = new Map<string,number>();

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet()

  copy( entryIndex:number, doc: any ) : ModuleType {
    return new ModuleType( entryIndex, this, doc );
  }

  constructor( entryIndex: number = -1, archetype: ModuleType = null, doc: any = null ){
    this.index = entryIndex;
    if( (archetype === null) || (doc === null) ){
      return;
    }

    // override defaults with pattern values
    this.description = archetype.description;
    this.mass = archetype.mass;
    this.process = archetype.process;
    this.mount = archetype.mount
    this.store = archetype.store;
    this.tags.update(archetype.tags);

    for( const [key,value] of Object.entries(doc)){
      //console.log(`      ${key} : ${value}`);
      if('description'.startsWith(key)){
        this.description = <string>value;
      }else if('key' === key){
        this.key = <string>value;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('name' === key){
        this.name = <string>value;;

      }else if('processes'.startsWith(key)){
        (<any>value).forEach( ea => { this.process.add(ea); } );

      }else if(('store' === key) || ('storage' === key)){
        // this is a Map< resource, quantity >
        // - storage type is a property of a resource, and merely inherited by storage
        for( const [key,qty] of Object.entries(value) ){
          this.store.set( key, <number>qty );
        }
      }else if('super' === key){
        this.superKey = doc['super'];

      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else if('mass' === key){
        this.mass = <number>value;
      }else if('mount' === key){
        this.mount = <string>value;
      }else if('volume'.startsWith(key)){
        this.volume = <number>value;
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name} : ${doc.key}`);
        return;
      }
    }
  }

  link( masterCatalog ): boolean {
    const processCatalog = masterCatalog.process;
    const resourceCatalog = masterCatalog.resource;

    this.process.forEach( key => {
      const found = processCatalog.contains(key);
      if( ! found){
        console.log(`    !!!! @<${this.typeName}>: ${this.key.padEnd(32)}  ... could not find process: ${key}`)
        return false;
      }
    });

    this.store.forEach( (qty,key) => {
      const found = resourceCatalog.contains(key);
      if( ! found){
        console.log(`    !!!! <${this.typeName}> @[${this.key.padEnd(32)}].storage: ${key}`)
        return false;
      }
    });
    
    return true;
  }

  str() : string {
    let str = `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"`;
    // if( this.superKey ){
    //   str += `\n              :^:${this.superKey}`;
    // }

    if( this.mass ){
      str += `\n              :mass: ${this.mass}`;
    }
    if( this.mount ){
      str += `\n              :mount: ${this.mount}`;
    }

    if( 0 < this.process.size ){
      str += '\n              :proc: '
          + Array.from(this.process).join(', ');
    }
    if( 0 < this.store.size ){
      str += '\n              :store: '
          + Array.from(this.store, ([rsc,qty]) => `${rsc}:${qty}`).join(', ');
    }
    
    if( 0 < this.tags.size ){
      str += `\n              :[${this.tags}]`;
    }

    return str;
  }

}

export default ModuleType;
