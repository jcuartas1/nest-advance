import { WithUuidMixin } from "src/common";

export class Coffee {
  constructor(public name: string){}
}

const CoffeeWithUuidCls = WithUuidMixin(Coffee);
const coffee = new CoffeeWithUuidCls('Buddy Brew');

