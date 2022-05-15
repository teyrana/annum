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
    return new WeaponType(entryIndex, doc );
  }

  constructor( entryIndex: number = -1, archetype: WeaponType = null, doc = null ){
    this.index = entryIndex;

    if( (archetype === null) || (doc === null) ){
      return;
    }

    this.description = archetype.description;
    this.mass = archetype.mass;
    this.process = archetype.process;
    this.mount = archetype.mount
    this.tags.update(archetype.tags);

    for( const [key,value] of Object.entries(doc)){
      if('description'.startsWith(key)){
        this.description = doc.desc;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('key' === key){
        this.key = <string>value;
      }else if('mass' === key){
        this.mass = <number>value;
      }else if('mount' === key){
        this.mount = <string>value;
      }else if('name' === key){
        this.name = <string>value;
      }else if('process'.startsWith(key)){
        this.process = <string>value;
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else{
        console.error(`!!!! Could not load JSON key: ${key} into class ${this.constructor.name}`);
      }
    }
  }

  link(other:any): boolean {
    //console.log(`    @ [${this.key}] <${this.typeName}>  ==>>  ${other.at(0).typeName}`);
    const found = other.contains(this.process);
    //console.log(`    -[${this.process}] => ${found}`);
    return found;
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
