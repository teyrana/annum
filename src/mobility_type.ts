
export class MobilityType {

  readonly code: number;
  readonly name: string;

  constructor( c:string, n:string ){
    this.code = c.toLowerCase().charCodeAt(0);
    this.name = n;
  }
  
  static readonly UNKNOWN =    new MobilityType('?', 'Unknown')
  static readonly STATIC =     new MobilityType('S', 'Static')
  static readonly INFANTRY =   new MobilityType('I', 'Infantry')
  static readonly WHEELED =    new MobilityType('W', 'Wheeled Vehicles')
  static readonly TRACKED =    new MobilityType('T', 'Tank Treads')
  static readonly MECH =       new MobilityType('M', 'Mechanized Walker') // similiar to 'infantry', but heavier
  static readonly HELICOPTER = new MobilityType('H', 'Helicopter')
  static readonly AIRPLANE =   new MobilityType('A', 'Airplane')
  static readonly BOAT =       new MobilityType('R', 'Riverine Boat')     // shallow draft, may land/dock at beaches
  static readonly SHIP =       new MobilityType('O', 'Ocean Ship')        // deep draft, requires port facilities
  static readonly SUBMARINE =  new MobilityType('U', 'Submarine')         // deep draft, even when surfaced
    

  static parse( text: string ): MobilityType {
    text = text.trim().toLowerCase();
    if( 1 == text.length ){
      switch(text.charCodeAt(0)){
        case MobilityType.STATIC.code:
          return MobilityType.STATIC;
        case MobilityType.INFANTRY.code:
          return MobilityType.INFANTRY;
        case MobilityType.WHEELED.code:
          return MobilityType.WHEELED;
        case MobilityType.TRACKED.code:
          return MobilityType.TRACKED;
        case MobilityType.MECH.code:
          return MobilityType.MECH;
        case MobilityType.HELICOPTER.code:
          return MobilityType.HELICOPTER;
        case MobilityType.AIRPLANE.code:
          return MobilityType.AIRPLANE;
        case MobilityType.BOAT.code:
          return MobilityType.BOAT;
        case MobilityType.SHIP.code:
          return MobilityType.SHIP;
        case MobilityType.SUBMARINE.code:
          return MobilityType.SUBMARINE;
      }
    }else if( text === 'static' ){
      return MobilityType.STATIC;
    }else if( text === 'infantry' ){
      return MobilityType.INFANTRY;
    }else if( text === 'infantry' ){
      return MobilityType.WHEELED;
    }else if( text === 'wheel' ){
      return MobilityType.TRACKED;
    }else if( text === 'track' ){
      return MobilityType.MECH;
    }else if( text === 'mech' ){
      return MobilityType.HELICOPTER;
    }else if( text === 'helo' ){
      return MobilityType.AIRPLANE;
    }else if( text === 'river' ){
      return MobilityType.BOAT;
    }else if( text === 'ship' ){
      return MobilityType.SHIP;
    }else if( text === 'sub' ){
      return MobilityType.SUBMARINE;
    }

    return MobilityType.UNKNOWN
  }
  
};


export default MobilityType;

