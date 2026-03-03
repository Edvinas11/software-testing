import * as fs from 'fs';
import * as path from 'path';
import type { UserRegistrationData } from '../types/test-data.types';

export const generateTestUserData = (): UserRegistrationData => {
   const timestamp = Date.now();

   return {
      email: `testuser_${timestamp}@qa.com`,
      password: 'VerySecurePassword123@',
      firstName: 'Tom',
      lastName: 'Sui',
      country: 'Lithuania',
      city: 'Vilnius',
      address: 'Verkiu g. 1',
      zipCode: '11111',
      phone: '37011111111'
   };
};

export const loadTestUsersFromFile = (
   filePath: string = path.resolve(__dirname, '../test-data/ecom-users.json')
): UserRegistrationData[] => {
   const raw = fs.readFileSync(filePath, 'utf-8');
   return JSON.parse(raw) as UserRegistrationData[];
};