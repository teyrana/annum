import loadAllTypes from './loaders'

if (require.main === module) {
  if(loadAllTypes()){
    console.log("<<= Loaded data Successfully.\n");
  }else{
    console.log("<<X Error while loading data.");
    process.exit(-99);
  }
}
