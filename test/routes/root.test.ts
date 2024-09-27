import { build } from "../helper";

describe('root', () => {
  const app = build();

  describe('GET /', () => {
    const url = '/'

    it('returns 200 ok', async () => {
      const res = await app.inject({ url });

      expect(res.json()).toEqual({ root: true });
    });
  });
});
