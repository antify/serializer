import {defineEncoder} from '../index';

export const jsonEncoder = defineEncoder<Object | Array<unknown>, string>({
  encode(data) {
    return JSON.stringify(data);
  },

  decode(data) {
    return JSON.parse(data);
  }
});
