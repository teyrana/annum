import BaseEntryType from './base_entry_type'
import TagSet from './tag_set'

class WeaponType implements BaseEntryType {
  readonly typeName: string = 'WeaponType';

  // default values:
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly mass: number = 0;
  readonly process: string = '';
  readonly mount: string = '';;

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet();

  copy( entryIndex: number, doc:any=null) : WeaponType {
    // add defaults, if not present
    if( doc.desc === 'undefined' ){
      doc['desc'] = this.description;
    }
    if( doc.mass === 'undefined' ){
      doc['mass'] = this.mass;
    }
    if( doc.process === 'undefined' ){
      doc['proc'] = this.process;
    }
    if( doc.desc === 'undefined' ){
      doc['mount'] = this.mount;
    }

    let other = new WeaponType(entryIndex, doc );

    other.tags.update(this.tags);

    return other;

  }

  constructor( entryIndex: number = -1, doc = null ){
    this.index = entryIndex;

    if( doc === null ){
      return;
    }

    for( const [key,value] of Object.entries(doc)){
      if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('key' === key){
        this.key = doc.key;
      }else if('mass' === key){
        this.mass = doc.mass;
      }else if('mount' === key){
        this.mount = doc.mount;
      }else if('name' === key){
        this.name = doc.name;
      }else if('process'.startsWith(key)){
        this.process == doc.process;
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

    if( this.mass ){
      str += `              :mass: ${this.mass}\n`;
    }
    if( this.process ){
      str += `              :process: ${this.process}\n`;
    }
    if( this.mount ){
      str += `              :mount: ${this.mount}\n`;
    }

    if( 0 < this.tags.size){
      str += `              :: Tags: [${this.tags}]\n`;
    }
    return str;
  }

}

export default WeaponType;
