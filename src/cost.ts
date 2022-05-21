
class Cost extends Map<string,number> {

  constructor(){
    super()
    this.set( 'time', 1);
  }
  
  // distinguished from set(<string>,<number>) by argument count:
  update( value ){
    for( const [key,quantity] of Object.entries(value) ){
      //const costKey: string = <any>key;
      //quantity: number = <any>key;
      this.set( key, <number>quantity );
    }

    return true;
  }

  toString(): string {
    let buf = '';
    this.forEach( (qty,rsc) => {
      buf += `${rsc}:${qty},  `;
    });
    return buf;
  }

};

export default Cost;
