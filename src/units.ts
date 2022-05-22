
class Unit {
  name: string;
  units: string;
  
  constructor(n:string, u:string){
    this.name = n;
    this.units = u;
  }
};

export class Units {

  static readonly KG_MASS = new Unit('Mass', 'kg');
  static readonly L_VOLUME = new Unit('Volume', 'L');
  static readonly NM_TORQUE = new Unit('Torque', 'Nm');
  static readonly PA_PRESSURE = new Unit('Pressure', 'Pa');
  static readonly SEC_TIME = new Unit('Time', 'sec');
  static readonly W_POWER = new Unit('Power', 'W');

  static parseUnitCode( key: string ): Unit {
    const code = key.toLocaleLowerCase().trim();
    
    if(('g' === code) || ('kg' === code)){
      return Units.KG_MASS;
    }else if( 'l' === code ){
      return Units.L_VOLUME;
    }else if('nm' === code){
      return Units.NM_TORQUE;
    }else if(('p' === code) || ('pa' === code)){
      return Units.PA_PRESSURE;
    }else if(('t' === code) || ('s' === code)){
      return Units.SEC_TIME;
    }else if( 'w' === code ){
      return Units.W_POWER;
    }else{
      return Units.KG_MASS;
    }
  }
};

export default Units;


