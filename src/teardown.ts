import pg from './services/postgres';
import 'jest-dynalite/dist/setupTables';
import 'jest-dynalite/dist/clearAfterEach';

afterAll(() => pg.end());
