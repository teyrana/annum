export class UnitType {
  name: string;
  units: string;

  constructor(n:string, u:string){
    this.name = n;
    this.units = u;
  }

  static readonly KG_MASS = new UnitType('Mass', 'kg');
  static readonly L_VOLUME = new UnitType('Volume', 'L');
  static readonly NM_TORQUE = new UnitType('Torque', 'Nm');
  static readonly PA_PRESSURE = new UnitType('Pressure', 'Pa');
  static readonly SEC_TIME = new UnitType('Time', 'sec');
  static readonly W_POWER = new UnitType('Power', 'W');

  static parseUnitCode( key: string ): UnitType {
    const code = key.toLocaleLowerCase().trim();
    
    if(('g' === code) || ('kg' === code)){
      return UnitType.KG_MASS;
    }else if( 'l' === code ){
      return UnitType.L_VOLUME;
    }else if('nm' === code){
      return UnitType.NM_TORQUE;
    }else if(('p' === code) || ('pa' === code)){
      return UnitType.PA_PRESSURE;
    }else if(('t' === code) || ('s' === code)){
      return UnitType.SEC_TIME;
    }else if( 'w' === code ){
      return UnitType.W_POWER;
    }else{
      return UnitType.KG_MASS;
    }
  }
}


export default UnitType;
