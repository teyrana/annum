export class StorageType {

  readonly name: string;
  
  private readonly _code: number;

  private static lookup = new Map<number,StorageType>();

  constructor(n:string, id:string){
    this.name = n;
    this._code = id.charCodeAt(0);
    StorageType.lookup.set( this._code, this);
  }

  static readonly ABSTRACT = new StorageType('ABSTRACT', 'a');  // used for items which have no storage limit: money, prestige, or experience
  static readonly BULK =     new StorageType('BULK',     'b');  // for solid resources in continuous, indeterminate quantities -- sand or coal
  static readonly DISCRETE = new StorageType('DISCRETE', 'd');  // for resources in discrete sizes: i.e. a sheep, a missile
  static readonly GAS =      new StorageType('GAS',      'g');
  static readonly LIQUID =   new StorageType('LIQUID',   'l');
  static readonly NONE =     new StorageType('None',     'n');  // cannot be stored:
  static readonly POWER =    new StorageType('POWER',    'p');  // for storage of electricity:

  get code(): string {
    return String.fromCharCode(this._code);
  }

  static parse( text: string ): StorageType {
    const code = text.charCodeAt(0);
    if( StorageType.lookup.has(code) ){
      return StorageType.lookup.get( code );
    }

    return StorageType.DISCRETE;
  }

}

export default StorageType;


