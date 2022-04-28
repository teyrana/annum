
export class TagSet extends Set<string> {

  update( other: any ){
    other.forEach( (tag) => { this.add(tag); } );
    return this;
  }

  toString(): string {
    return Array.from(this).join(',');
  }

}

export default TagSet;
