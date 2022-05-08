import BaseEntryType from './base_entry_type'
import TagSet from './tag_set'

class TechnologyType implements BaseEntryType {
  readonly typeName: string = 'TechnologyType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly requires = new Set<string>();

  readonly tags? = new TagSet();

  copy( entryIndex: number, doc:any=null) : TechnologyType {
    // add defaults, if not present
    if( doc.desc === 'undefined' ){
      doc['desc'] = this.description;
    }
    if( 0 < this.requires.size ){
      this.requires.forEach( ea => { doc['req'].set(ea); });
    }

    let newCopy = new TechnologyType( entryIndex, doc );

    newCopy.tags.update(this.tags);

    return newCopy;
  }

  constructor( entryIndex: number = -1, doc = null ){
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
      }else if('requires'.startsWith(key)){
        if( typeof value === 'string'){
          this.requires.add(value);
        }else{
          (<any>value).forEach( ea => {
            this.requires.add(ea);
          });
        }
      }else if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
      }
    }
  }

  str() : string {
    let str = '';
    str += `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"\n`;

    if( this.requires.size){
      str += '              :: Requires:\n';
      str += `                  - ${Array.from(this.requires).join(", ")}\n`;
    }

    if( 0 < this.tags.size){
      str += `              :: Tags: [${this.tags}]\n`;
    }
    return str;
  }

}

export default TechnologyType;
