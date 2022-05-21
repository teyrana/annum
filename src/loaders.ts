import BaseEntryType from './base_entry_type'
import EntryCatalog from './entry_catalog'
import TagSet from './tag_set'

import BuildingType from './building_type'
import * as buildingData from '../data/buildings.json';

import ModuleType from './module_type'
import * as moduleData from '../data/modules.json';

//import ProcessType from './process_type'
//import * as processData from '../data/processes.json';

import ProcessType from './process_type'
import * as processData from '../data/processes.json';

import ResourceType from './resource_type'
import * as resourceData from '../data/resources.json';

import TechnologyType from './technology_type'
import * as technologyData from '../data/technologies.json';

import WeaponType from './weapon_type'
import * as weaponData from '../data/weapons.json';

function collectAllTags( masterCatalog ){
  collectTags( masterCatalog.building, masterCatalog.tags );
  collectTags( masterCatalog.module, masterCatalog.tags );
  // collectTags( masterCatalog.platform, masterCatalog.tags );
  collectTags( masterCatalog.process, masterCatalog.tags );
  collectTags( masterCatalog.resource, masterCatalog.tags );
  collectTags( masterCatalog.technology, masterCatalog.tags );
  // collectTags( masterCatalog.unit, masterCatalog.tags );
  collectTags( masterCatalog.weapon, masterCatalog.tags );
}

function collectTags( catalog: EntryCatalog<BaseEntryType>, allTags: TagSet ){
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
  console.log(`    >>> Loading: ${rowCount} <${archetype.typeName}> entries.`);
  
  let catalog = new EntryCatalog<EntryType>();

  let entryCount = 0;
  for (let [key,row] of Object.entries(data)){
    row['key'] = key;

    try {
      let entry: EntryType = null;
      if( 'super' in <any>row ){
        let superKey: string = row['super'];
        if(catalog.contains(superKey)){
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

    } catch(err) {
      console.error(`??? @key=${key}, Error: " + err`);
      throw err;
    }
  }

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
  console.log("==>> Stage 1: Load Entries...");
  console.log("   :: Load Order Dependencies:\n");
  console.log("    resource => process");
  console.log("                process => modules");
  console.log("    resource =>            modules");
  console.log("                           modules => buildings");
  console.log("                           modules => platform");
  console.log("                                      platform => unit");
  console.log("                process => weapons");
  console.log("    technology"); // no dependency
  //  console.log("    technology => process"); // NYI

  // master catalog
  let catalog = {'building': null,
                 'tags': new TagSet(),
                 'module': null,
                 'platform': null,
                 'process': null,
                 'resource': null,
                 'technology': null,
                 'unit': null,
                 'weapon': null};


  console.log("  >> 1:A: Loading Buildings...");
  const buildingArchetype = new BuildingType();
  catalog.building = loadType<BuildingType>(buildingData, buildingArchetype );
  const loadBuildingsSuccess = (0 < catalog.building.size);

  console.log("  >> 1:B: Loading Modules...");
  const moduleArchetype = new ModuleType();
  catalog.module = loadType<ModuleType>(moduleData, moduleArchetype );
  const loadModulesSuccess = (0 < catalog.module.size);

  console.log("  >> 1:C: Loading Platforms...");
  const loadPlatformsSuccess = true;
  // const platformArchetype = new platformType();
  // catalog.platform = loadType<PlatformType>(platformData, platformArchetype );
  // const loadplatformsSuccess = (0 < catalog.platform.size);

  console.log("  >> 1:D: Loading Processes...");
  const processArchetype = new ProcessType();
  catalog.process = loadType<ProcessType>(processData, processArchetype );
  const loadProcessesSuccess = (0 < catalog.process.size);

  console.log("  >> 1:E: Loading Resources...");
  const resourceArchetype = new ResourceType();
  catalog.resource = loadType<ResourceType>(resourceData, resourceArchetype );
  const loadResourcesSuccess = (0 < catalog.resource.size);

  console.log("  >> 1:F: Loading Technologies...");
  const technologyArchetype = new TechnologyType();
  catalog.technology = loadType<TechnologyType>(technologyData, technologyArchetype );
  const loadTechnologiesSuccess = (0 < catalog.technology.size);

  console.log("  >> 1:G: Loading Units...");
  const loadUnitsSuccess = true;
  // const unitArchetype = new unitType();
  // catalog.unit = loadType<FnitType>(unitData, unitArchetype );
  // const loadFnitsSuccess = (0 < catalog.unit.size);
  // collectTags( catalog.unit, allTags );

  console.log("  >> 1:H: Loading Weapons...");
  const weaponArchetype = new WeaponType();
  catalog.weapon = loadType<WeaponType>(weaponData, weaponArchetype );
  const loadWeaponsSuccess = (0 < catalog.weapon.size);


  collectAllTags( catalog );

  // debug
  if( true ){
    //console.log("   << Stage 1.b. // DEBUG");
    // printEntries( resources);
    //printEntries( resources, 'tiberium' );
    // printEntries( processes, 'tiberium');
    //printEntries( technologies, 'tiberium');
    //printEntries( weapons);
    //console.log(`<<== Loaded ${allTags.size} tags.`);
    //console.log(`    ${Array.from(allTags).join(',')}`);
    //printEntries( modules );
  }
  // debug

  console.log("==>> Stage 3: Link Entries...");

  console.log("  >> 2:A: Link Buildings to Modules ...");
  //catalog.building.link( ??? ); // NYI

  console.log("  >> 2:B: Link Modules to Processes  ...");
  catalog.module.link( catalog );

  console.log("  >> 2:C: Link Platforms to [???]  ...");


  console.log("  >> 2:D: Link Processes to Resources...");
  catalog.process.link( catalog );

  // console.log("  >> 2:E: Link Resources...");
  //     => no linking required

  // console.log("  >> 2:F: Link Technologies to (Technologies)  ...");
  //     => already linked (linking performed during load)

  console.log("  >> 2:G: Link Units to [???]  ...");

  console.log("  >> 2:H: Link Weapons to Processes...");
  catalog.weapon.link( catalog );



  
  // ...


  return (loadBuildingsSuccess
    && loadModulesSuccess
    && loadResourcesSuccess
    && loadPlatformsSuccess
    && loadProcessesSuccess
    && loadTechnologiesSuccess
    && loadUnitsSuccess
    && loadWeaponsSuccess);
}

export default loadAllTypes;
