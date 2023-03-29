import { faker } from '@faker-js/faker';

export const API_PRFIX = '/v1/api';
export const userInput = {
  firstName: 'Davin',
  lastName: 'Lind',
  email: 'davin.lind@example.com',
  password: 'M5j2RgG3b9hCDqh',
  passwordConfirmation: 'M5j2RgG3b9hCDqh',
};

console.log(faker.internet.email());
