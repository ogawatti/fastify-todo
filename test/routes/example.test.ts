import { test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'

void test('example is loaded', async (t) => {
  const app = await build(t)

  const res = await (app as any).inject({
    url: '/example'
  })

  assert.equal(res.payload, 'this is an example')
})
