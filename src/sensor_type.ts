export class SensorType {

  readonly code: number
  readonly name: string
  readonly description: string

  constructor( c: string, n: string, d: string ){
    this.code = c.toLowerCase().charCodeAt(0)
    this.name = n
    this.description = d
  }

  static readonly UNKNOWN =    new SensorType('?', 'Unknown', '')
  static readonly VISUAL =     new SensorType('V', 'Visual', 'visual-spectrum; default')
  static readonly INFRARED =   new SensorType('I', 'Infrared','Includes Night Vision')
  static readonly AIRBORNE =   new SensorType('A', 'Airborne','can see over walls cliffs, and other terrain')
  static readonly RADAR =      new SensorType('R', 'Radar','Can see through Fog, Rain, Dust, etc')
  static readonly ELECTRONIC = new SensorType('E', 'Electronic','detects any sort of electronic emisions, like radio, cell phones, RADAR, etc')
    
  static parse( text: string ): SensorType {
    text = text.trim().toLowerCase();

    if( 1 == text.length ){
      switch(text.charCodeAt(0)){
        case SensorType.VISUAL.code:
          return SensorType.VISUAL;
        case SensorType.INFRARED.code:
          return SensorType.INFRARED;
        case SensorType.AIRBORNE.code:
           return SensorType.AIRBORNE;
        case SensorType.RADAR.code:
           return SensorType.RADAR;
        case SensorType.ELECTRONIC.code:
          return SensorType.ELECTRONIC;
        default:
          return SensorType.UNKNOWN;
      }
    }else{
      if('eye' === text){
        return SensorType.VISUAL
      }else if('ir' === text){
        return SensorType.INFRARED
      }else if('air' === text){
        return SensorType.AIRBORNE
      }else if('radar' === text){
            return SensorType.RADAR
      }else if('ew' === text){
        return SensorType.ELECTRONIC
      }
      return SensorType.UNKNOWN
    }
  }


};

export default SensorType;
