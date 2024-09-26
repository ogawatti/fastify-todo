import * as path from 'path'
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload'
import { FastifyPluginAsync } from 'fastify'

const _dirname = __dirname

export type AppOptions = {} & Partial<AutoloadPluginOptions>

const options: AppOptions = {}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: path.join(_dirname, 'plugins'),
    options: opts,
    forceESM: true
  })

  void fastify.register(AutoLoad, {
    dir: path.join(_dirname, 'routes'),
    options: opts,
    forceESM: true
  })
}

export default app
export { app, options }
