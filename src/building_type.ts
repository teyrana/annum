import BaseEntryType from './base_entry_type'
import Cost from './cost'
import TagSet from './tag_set'

class BuildingType implements BaseEntryType {
  readonly typeName: string = 'BuildingType';
  
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly armor: number = 10.0;
  readonly size: {x:number, y:number} = {x:1,y:1};
  readonly hitpoints: number = 1000;
  readonly modules = new Set<string>();
  readonly cost = new Cost();
  readonly volume: number = 0;

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet();

  copy( entryIndex: number, doc:any=null) : BuildingType {
    // add defaults, if not present
    if( doc.desc === 'undefined' ){
      doc['desc'] = this.description;
    }

    if( doc.armor === 'undefined' ){
      doc['armor'] = this.armor
    }
    if( doc.size === 'undefined' ){
      doc['size'] = Object.assign({}, this.size);
    }
    if( doc.hitpoints === 'undefined' ){
      doc['hitpoints'] = this.hitpoints;
    }

    let other = new BuildingType(entryIndex, doc );

    other.tags.update(this.tags);

    //other.modules.update(this.modules);

    return other;

  }

  constructor( entryIndex: number = -1, doc = null ){
    this.index = entryIndex;

    if( doc === null ){
      return;
    }

    for( const [key,value] of Object.entries(doc)){
      if('armor' === key){
        this.armor = <number>value;
      }else if('cost' === key){
        this.cost.update(value);
      }else if('description'.startsWith(key)){
        this.description = <string>value;
      }else if( ('hp' === key) || ('hitpoints' === key) ){
        this.hitpoints = <number>value;
      }else if('key' === key){
        this.key = <string>value;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('name' === key){
        this.name = <string>value;
      }else if('modules'.startsWith(key)){
        for( const key of Object.entries(value) ){
          const moduleKey: string = <any>key;
          this.modules.add( moduleKey );
        };
      }else if('size' === key ){
        this.size = {x: value[0], y:value[1]};
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else if('volume'.startsWith(key)){
        this.volume = <number>value;
      }else{
        console.error(`!!!! Could not load into: ${this.constructor.name} // at entry: ${doc.key}    // json key: ${key}`);
      }
    }
  }

  link(other:any): boolean {
    //console.log(`    @ [${this.key}] <${this.typeName}>  ==>>  ${other.at(0).typeName}`);

    // this could probably be converted to a map-reduce, or something
    this.modules.forEach( (qty,key) => {
      const found = other.contains(key);
      if( ! found){
        console.log(`    !! could not find module: ${key} in building: ${this.key}`);
        return false;
      }
    });

    return true;
  }

  str() : string {
    let str = '';
    str += `          - [${this.index.toString().padStart(3)}][${this.key}]: "${this.name}"\n`;


    if( 0 < this.tags.size){
      str += `              :: Tags: [${this.tags}]\n`;
    }
    return str;
  }

}

export default BuildingType;
