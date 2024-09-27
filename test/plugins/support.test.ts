import { build } from "../helper";

describe('Support Plugin', () => {
  const app = build();

  it('returns "hugs"', async () => {
    expect(app.someSupport()).toBe('hugs');
  });
});
