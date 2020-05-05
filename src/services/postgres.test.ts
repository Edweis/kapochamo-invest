import pg from './postgres';

describe('check connexion', () => {
  it('should select 1', async () => {
    const result = await pg.query('SELECT 1 as hey');
    expect(result.rows[0]).toEqual({ hey: 1 });
  });
});
