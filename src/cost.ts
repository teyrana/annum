
class Cost extends Map<string,number> {
  
  // distinguished from set(<string>,<number>) by argument count:
  update( value ){
    for( const [key,quantity] of Object.entries(value) ){
      //const costKey: string = <any>key;
      //quantity: number = <any>key;
      this.set( key, <number>quantity );
    }

    return true;
  }

  

};

export default Cost;
