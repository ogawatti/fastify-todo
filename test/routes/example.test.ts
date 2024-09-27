import { build } from "../helper";

describe('example', () => {
  const app = build();

  describe('GET /example', () => {
    const url = '/example';

    it('return 200 ok', async () => {
      const res = await app.inject({ url });

      expect(res.payload).toEqual('this is an example');
    });
  });
});
