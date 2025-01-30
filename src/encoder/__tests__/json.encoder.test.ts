import {describe, expect, test} from 'vitest';
import {jsonEncoder} from '../json.encoder';

describe('Json encoder tests', () => {
  const encodedData = '{"name":"John Doe","age":32,"isStudent":true,"address":{"street":"123 Main St","city":"Springfield","state":"IL"},"hobbies":["reading","coding","swimming"]}';
  const decodedData = {
    name: 'John Doe',
    age: 32,
    isStudent: true,
    address: {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL'
    },
    hobbies: ['reading', 'coding', 'swimming']
  };

  test('Should encode data correctly', () => {
    expect(jsonEncoder.encode(decodedData)).toBe(encodedData);
  });

  test('Should decode data correctly', () => {
    expect(jsonEncoder.decode(encodedData)).toStrictEqual(decodedData);
  });
});
