export class User {
  id: number = 0;
  name: string = '';
  age: number = 0;
  address: Record<string, any> = {};
  additional_info: Record<string, any> = {};

  constructor(id: number, name: string, age: number, address: Record<string, any>, additional_info: Record<string, any>) {
    this.id = id;
    this.name = name;
    this.age = age;
    this.address = address;
    this.additional_info = additional_info;
  }
}
