import BaseEntryType from './base_entry_type'
import EntryTable from './entry_table'
import ModuleType from './module_type'
import PlatformType from './platform_type'
import ProcessType from './process_type'
import ResourceType from './resource_type'
import TagSet from './tag_set'
import TechnologyType from './technology_type'
import UnitType from './unit_type'



export class Catalog { 
  
  module: EntryTable<ModuleType> = null;
  platform: EntryTable<PlatformType> = null; 
  process: EntryTable<ProcessType> = null; 
  resource: EntryTable<ResourceType> = null; 
  technology: EntryTable<TechnologyType> = null; 
  unit: EntryTable<UnitType> = null; 
  
  tags: TagSet                           =  new TagSet();
  
  //constructor(){}

  collectTags( table: EntryTable<BaseEntryType> ){
    for( const entry of table ){
      if( typeof entry.tags === 'undefined'){
        console.error("!?: entry.tags is undefined on: " + entry.key );
      }
      this.tags.update(entry.tags);
    }
  }

  collectAllTags() {
    this.collectTags( this.module );
    this.collectTags( this.platform );
    this.collectTags( this.process );
    this.collectTags( this.resource );
    this.collectTags( this.technology );
    this.collectTags( this.unit );
  }
  
  // [Symbol.iterator]() : Iterator<EntryType> {
  //   let i = -1;
  //   return {
  //     next: () => {
  //       i++;
  //       if (i < this.index.length){
  //         //console.log(`....Fetching: [${i}]: ${this.index[i]}`);
  //         return {value: this.index[i], done: false}
  //       } else {
  //         //console.log(`....Fetching: [${i}]: null;`);
  //         return {value: null, done: true}
  //       }
  //     }
  //   }
  // }

};

export default Catalog;
