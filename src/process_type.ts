import BaseEntryType from './base_entry_type'
import ResourceType from './resource_type'
import TagSet from './tag_set'

class ProcessType implements BaseEntryType {
  readonly typeName: string = 'ProcessType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  // readonly io = new Map<ResourceType,number>();
  readonly io = new Map<string,number>();

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet();

  copy( entryIndex: number, doc:any=null) : ProcessType {
    return new ProcessType(entryIndex, this, doc );
  }

  constructor( entryIndex: number = -1, archetype: ProcessType = null, doc = null ){
    this.index = entryIndex;

    if( (archetype === null) || (doc === null) ){
       return;
    }
 
    this.description = archetype.description;
    this.tags.update(archetype.tags);

    // add defaults, if not present
    if( doc.desc === 'undefined' ){
      doc['desc'] = this.description;
    }

    for( const [key,value] of Object.entries(doc)){
      if('key' === key){
        this.key = doc.key;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('name' === key){
        this.name = doc.name;
      }else if('io' === key){
        for( const [key,qty] of Object.entries(doc.io) ){
          this.io.set(key,<number>qty);
        };
      }else if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
      }
    }
  }

  link( masterCatalog ): boolean {
    const resourceCatalog = masterCatalog.resource;

    //console.log(`    @ [${this.key}] <${this.typeName}>`);

    this.io.forEach( (qty,key) => {
      const found = resourceCatalog.contains(key);
      if( ! found){
        console.log(`    !! could not find resource: ${key} for process: ${this.key}`);
        return false;
      }
    });

    return true;
  }

  str() : string {
    let str = '';
    str += `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"\n`;

    if( 0 < this.io.size){
      str += `              :: Inputs / Outputs:\n`;
      this.io.forEach( (qty,key) => {
        const pad = 20;
        str += `                  - ${key.padEnd(pad,'.')}`
             + ` ${(0<qty)?' ':''} ${qty}\n`;
      });
    }
    if( 0 < this.tags.size){
      str += `              :: Tags: [${this.tags}]\n`;
    }
    return str;
  }

}

export default ProcessType;
