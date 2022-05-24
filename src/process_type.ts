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
  
  readonly io: Map<ResourceType, number> = null;

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet();

  copy( entryIndex: number, doc:any, catalog ) : ProcessType {
    return new ProcessType(entryIndex, this, doc, catalog );
  }

  constructor( entryIndex: number = -1, archetype: ProcessType = null, doc = null, catalog = null ){
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

    // temporary cache -- just for the keys
    let inputOutputKeys = new Map<string,number>();
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
          inputOutputKeys.set(key,<number>qty);
        };
      }else if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
      }
    }

    // Load Dependent classes:
    // (A) I/O: find resources by key => load iff found
    const loadInputOutput = new Map<ResourceType,number>();
    inputOutputKeys.forEach( (quantity, resourceKey) => {
      if( catalog.resource.contains(resourceKey) ){
        loadInputOutput.set( catalog.resource.get(resourceKey), quantity );
      }else{
        console.log(`    !! could not find resource: ${resourceKey} for process: ${this.key}`);
        return;
      }
    });
    this.io = loadInputOutput;
  }

  str() : string {
    let str = '';
    str += `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"\n`;

    if( 0 < this.io.size){
      str += `              :: Inputs / Outputs:\n`;
      this.io.forEach( (qty, rsc) => {
        const pad = 20;
        str += `                  - ${rsc.key.padEnd(pad,'.')}`
             + ` ${(0<qty)?' ':''} ${qty}\n`;
      });
    }
    if( 0 < this.tags.size){
      str += `              :: Tags: [${this.tags}]\n`;
    }
    return str;
  }

  valid(): boolean {
    if(null === this.io){
      return false;
    }
    return true;
  }

}

export default ProcessType;
