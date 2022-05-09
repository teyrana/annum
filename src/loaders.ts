import BaseEntryType from './base_entry_type'
import EntryCatalog from './entry_catalog'
import TagSet from './tag_set'

import ResourceType from './resource_type'
import * as resourceData from '../data/resources.json';

import ProcessType from './process_type'
import * as processData from '../data/processes.json';

import TechnologyType from './technology_type'
import * as technologyData from '../data/technologies.json';

import WeaponType from './weapon_type'
import * as weaponData from '../data/weapons.json';

function collectTags( catalog, allTags: TagSet ){
  for( const entry of catalog ){
    if( typeof entry.tags === 'undefined'){
      console.error("!?: entry.tags is undefined on: " + entry.key );
    }
    allTags.update(entry.tags);
  }
  return allTags;
}

function loadType<EntryType extends BaseEntryType>( data, archetype: EntryType )
  : EntryCatalog<EntryType>
{
  let rowCount = Object.keys(data).length;
  console.log(`    >>> JSON File Loaded.  Found: ${rowCount} <${archetype.typeName}> entries.`);
  
  let catalog = new EntryCatalog<EntryType>();

  let entryCount = 0;
  for (let [key,row] of Object.entries(data)){
    row['key'] = key;

    try {
      let entry: EntryType = null;
      if( 'super' in <any>row ){
        let superKey: string = row['super'];
        if(catalog.contains(superKey)){
          //console.log(`          @ [${row['key']}]: super=${superKey}`);
          let superEntry = catalog.by(superKey);
          entry = superEntry.copy(entryCount, row);
          entryCount++;
        }else{
          console.log(`     !!!! Referenced non-existent super class while loading type: <${archetype.typeName}>  superKey=${superKey}`);
          return catalog;
        }
      }else{
        entry = archetype.copy(entryCount, row);
        entryCount++;
      }

      catalog.add(entry);

      // debug
      // if( entry.tags && entry.tags.has('tiberium') ){ 
      //   console.log(`        - [${entry.index.toString().padStart(3)}][${entry.key}]: "${entry.name}"`);
      // }
      // debug 

    } catch(err) {
      console.error(`??? @key=${key}, Error: " + err`);
      throw err;
    }
  }

  console.log(`    <<: Finished Loading.`);
  return catalog;
}

function printEntries<EntryType extends BaseEntryType>( catalog: EntryCatalog<EntryType>, tag: string = null): void {
  console.log(`    ## Printing entries for: <${catalog.at(0).typeName}> // ${tag}`);
  for( const entry of catalog ){
    if( tag===null || (entry.tags.has(tag)) ){
      console.log(entry.str());
    }
  }
}

export function loadAllTypes(): boolean {
  const allTags = new TagSet();

  console.log("==>> [1] Loading Resources...");
  const resourceArchetype = new ResourceType();
  const resources = loadType<ResourceType>(resourceData, resourceArchetype );
  const loadResourcesSuccess = (0 < resources.size);
  collectTags( resources, allTags );

  console.log("==>> [2] Loading Processes...");
  const processArchetype = new ProcessType();
  const processes = loadType<ProcessType>(processData, processArchetype );
  const loadProcessesSuccess = (0 < processes.size);
  collectTags( processes, allTags );

  console.log("==>> [3] Loading Technologies...");
  const technologyArchetype = new TechnologyType();
  const technologies = loadType<TechnologyType>(technologyData, technologyArchetype );
  const loadTechnologiesSuccess = (0 < technologies.size);
  collectTags( technologies, allTags );

  console.log("==>> [6] Loading Weapons...");
  const weaponArchetype = new WeaponType();
  const weapons = loadType<WeaponType>(weaponData, weaponArchetype );
  const loadWeaponsSuccess = (0 < weapons.size);
  collectTags( weapons, allTags );


  // debug
  //printEntries( resources);
  //printEntries( resources, 'tiberium' );
//  printEntries( processes, 'tiberium');
  //printEntries( technologies, 'tiberium');
  printEntries( weapons);
  // debug

  if( loadResourcesSuccess && loadProcessesSuccess ){
    // vvv NYI vvv
//    processes.link( resources );
    // ^^^ NYI ^^^
  }

  if( loadProcessesSuccess && loadWeaponsSuccess ){
    // vvv NYI vvv
//    weapons.link( processes );
    // ^^^ NYI ^^^
  }


  console.log(`<<== Loaded ${allTags.size} tags.`);
  //console.log(`    ${Array.from(allTags).join(',')}`);

  return (loadResourcesSuccess
    && loadProcessesSuccess
    && loadTechnologiesSuccess
    && loadWeaponsSuccess);
}

export default loadAllTypes;
