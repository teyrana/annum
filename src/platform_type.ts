import BaseEntryType from './base_entry_type'
import Cost from './cost'
import TagSet from './tag_set'
import MobilityType from './mobility_type'
import SensorType from './sensor_type'

class PlatformType implements BaseEntryType {
  readonly typeName: string = 'PlatformType';
  
  readonly name: string = 'default-name';
  readonly description: string = '';
  readonly index: number = 0;
  readonly key: Lowercase<string> = 'default_key';
  
  readonly armor: number = 10.0;
  // this 10x10x10 === 1 map tile is the default building & vehicle size
  readonly dimensions = {'height':10, 'width':10, 'length':10}; 
  //readonly dimensions: BoundingBox = new BoundingBox();
  // needed for buildings -> should define a canonical tile size -> 10m x 10m?
  // default size is this 1x1 tile === (10m x 10m)

  readonly mobility: MobilityType = MobilityType.STATIC;

  readonly hitpoints: number = 1000;
  readonly mass: number = 1000;
  readonly modules = new Set<string>();

  readonly superKey?: string;
  readonly tags?: TagSet = new TagSet();

  copy( entryIndex: number, doc:any=null) : PlatformType {
    return new PlatformType(entryIndex, this, doc );
  }

  constructor( entryIndex: number = -1, archetype: PlatformType = null, doc = null ){
    this.index = entryIndex;

    if( (archetype === null) || (doc === null) ){
      return;
    }

    this.armor = archetype.armor;
    this.description = archetype.description;
    this.dimensions = archetype.dimensions
    this.hitpoints = archetype.hitpoints;
    this.mass = archetype.mass;
    this.mobility = archetype.mobility;
    this.tags.update(archetype.tags);

    for( const [key,value] of Object.entries(doc)){
      if('armor' === key){
        this.armor = <number>value;
      }else if('description'.startsWith(key)){
        this.description = <string>value;
      }else if( key === 'height'){
        this.dimensions.height = <number>value;
      }else if( ('hp' === key) || ('hitpoints' === key) ){
        this.hitpoints = <number>value;
      }else if('index' === key){
        console.error('!!!! not allowed to explicitly set the index field in input data. Aborting.');
        return;
      }else if('key' === key){
        this.key = <string>value;
      }else if( key === 'length'){
        this.dimensions.length = <number>value;
      }else if('name' === key){
        this.name = <string>value;
      }else if('mass' === key){
        this.mass = <number>value;
      }else if( ('move'===key) || ('mobility'.startsWith(key)) ){
        this.mobility = MobilityType.parse(<string>value);
      }else if('modules'.startsWith(key)){
        for( const key of Object.entries(value) ){
          this.modules.add( <any>key );
        };
      }else if('size' === key ){
        this.dimensions.length = value[0];
        this.dimensions.width = value[1];
        this.dimensions.height = value[2];
      }else if(key.startsWith('tag')){
        this.tags.update(value);
      }else if(key === 'width'){
        this.dimensions.width = <number>value;

      }else{
        console.error(`!!!! Could not load into: ${this.constructor.name} // at entry: ${doc.key}    // json key: ${key}`);
      }
    }
  }

  link( other:any ): boolean {
    //console.log(`    @ [${this.key}] <${this.typeName}>  ==>>  ${other.at(0).typeName}`);

    // this could probably be converted to a map-reduce, or something
    this.modules.forEach( (qty,key) => {
      if( ! other.contains(key) ){
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

export default PlatformType;
