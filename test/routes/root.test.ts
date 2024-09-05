import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'

void test('default root route', async (t) => {
  const app = await build(t)

  const res = await (app as any).inject({
    url: '/'
  })
  assert.deepStrictEqual(JSON.parse(res.payload), { root: true })
})
