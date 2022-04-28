import loadAllTypes from './loaders'

if (require.main === module) {
  if(loadAllTypes()){
    console.log("==>> Loaded data Successfully.\n");
  }else{
    console.log("<<XX Error while loading data.");
    process.exit(-99);
  }
}
