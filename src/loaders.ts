import BaseEntryType from './base_entry_type'
import EntryCatalog from './entry_catalog'
import TagSet from './tag_set'

// .1. resource
import ResourceType from './resource_type'
import * as resourceData from '../data/resources.json';

// .2. process
import ProcessType from './process_type'
import * as processData from '../data/processes.json';

// .3. modules
import ModuleType from './module_type'
import * as moduleData from '../data/modules.json';

// .4. platform
import PlatformType from './platform_type'
import * as platformData from '../data/platforms.json';

// .5. unit
import UnitType from './unit_type'
import * as unitData from '../data/units.json';

// .6. technology
import TechnologyType from './technology_type'
import * as technologyData from '../data/technologies.json';


const earlyExit : boolean = true;

function collectAllTags( masterCatalog ){
  collectTags( masterCatalog.module, masterCatalog.tags );
  // collectTags( masterCatalog.platform, masterCatalog.tags );
  collectTags( masterCatalog.process, masterCatalog.tags );
  collectTags( masterCatalog.resource, masterCatalog.tags );
  collectTags( masterCatalog.technology, masterCatalog.tags );
  // collectTags( masterCatalog.unit, masterCatalog.tags );
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

function loadType<EntryType extends BaseEntryType>( data, archetype: EntryType, masterCatalog )
  : EntryCatalog<EntryType>
{
  let rowCount = Object.keys(data).length;
  console.log(`    >>> Loading: ${rowCount} <${archetype.typeName}> entries.`);
  
  let entryCatalog = new EntryCatalog<EntryType>();

  let entryCount = 0;
  for (let [key,row] of Object.entries(data)){
    row['key'] = key;

    try {
      let entry: EntryType = null;
      if( 'super' in <any>row ){
        let superKey: string = row['super'];
        if(entryCatalog.contains(superKey)){
          let superEntry = entryCatalog.by(superKey);
          entry = superEntry.copy(entryCount, row, masterCatalog);
          entryCount++;
        }else{
          console.log(`     !!!! Referenced non-existent super class while loading type: <${archetype.typeName}>  superKey=${superKey}`);
          return null;
        }
      }else{
        entry = archetype.copy(entryCount, row, masterCatalog);
        entryCount++;
      }

      if( ! entry.valid() ){
        console.log(`  <<!! Invalid entry!! <${archetype.typeName}>:[${entry.key}]`);
        if(earlyExit){
          return null;
        }
      }else{
        entryCatalog.add(entry);
      }

    } catch(err) {
      console.error(`??? @key=${key}, Error: " + err`);
      throw err;
    }
  }

  return entryCatalog;
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
  console.log("==>> Stage A: Load Entries...");
  //    :: Load Order Dependencies:\n");
  //       resource(1) => process(2) => modules(3) => platform(4) => unit(5)");
  //       technology(6)");

  // master catalog
  let catalog = {'module': null,
                 'platform': null,
                 'process': null,
                 'resource': null,
                 'tags': new TagSet(),
                 'technology': null,
                 'unit': null};

  console.log("  >> A:1: Load Resources...");
  catalog.resource = loadType<ResourceType>( resourceData, new ResourceType(), catalog );
  const loadResourcesSuccess = (null !== catalog.resource);
  if( earlyExit && ! loadResourcesSuccess ){
    return false; }

  console.log("  >> A:2: Load Processes...");
  catalog.process = loadType<ProcessType>( processData, new ProcessType(), catalog );
  const loadProcessesSuccess = (null !== catalog.process);
  if( earlyExit && ! loadProcessesSuccess ){
    return false;}

  console.log("  >> A:3: Load Modules...");
  catalog.module = loadType<ModuleType>( moduleData, new ModuleType(), catalog );
  const loadModulesSuccess = (null !== catalog.module);
  if( earlyExit && ! loadModulesSuccess ){
    return false; }

  console.log("  >> A:4: Load Platforms...");
  catalog.platform = loadType<PlatformType>(platformData, new PlatformType(), catalog );
  const loadPlatformsSuccess = (null !== catalog.platform);

  console.log("  >> A:5: Loading Units...");
  catalog.unit = loadType<UnitType>(unitData, new UnitType(), catalog );
  const loadUnitsSuccess = (null !== catalog.unit);

  console.log("  >> A:6: Loading Technologies...");
  catalog.technology = loadType<TechnologyType>(technologyData, new TechnologyType(), catalog );
  const loadTechnologiesSuccess = (null !== catalog.technology);

  // console.log("  >> 1:A: Loading Buildings...");
  // const buildingArchetype = new BuildingType();
  // catalog.building = loadType<BuildingType>(buildingData, buildingArchetype );
  // const loadBuildingsSuccess = (0 < catalog.building.size);

  // console.log("  >> 1:H: Loading Weapons...");
  // const weaponArchetype = new WeaponType();
  // catalog.weapon = loadType<WeaponType>(weaponData, weaponArchetype );
  // const loadWeaponsSuccess = (0 < catalog.weapon.size);

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


  return (loadResourcesSuccess
       && loadProcessesSuccess
       && loadModulesSuccess
       && loadPlatformsSuccess
       && loadUnitsSuccess
       && loadTechnologiesSuccess
  );
}

export default loadAllTypes;
