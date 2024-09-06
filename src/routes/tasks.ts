import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import prisma from '../lib/prisma.js'
import { Prisma } from '@prisma/client'

interface ITaskParams {
  id: string
}

interface ITaskCreateBody {
  title: string
}

interface ITaskUpdateBody extends ITaskCreateBody {
  done?: boolean
}

type TaskRequest = FastifyRequest<{
  Params: ITaskParams
  Body: ITaskCreateBody | ITaskUpdateBody
}>

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook('onRequest', async (request: TaskRequest, reply) => {
    if (request.raw.url?.match(/^\/tasks\/+\d/)) {
      const id = +request.params.id
      const task = await prisma.task.findUnique({ where: { id } })

      if (task === null) {
        await reply.code(404).send({ message: 'Task not found' })
      }
    }
  })

  fastify.get('/tasks', async function (request: TaskRequest, reply): Promise<Array<Prisma.TaskGetPayload<{}>>> {
    return await prisma.task.findMany({ where: { done: false } })
  })

  fastify.post<{ Body: ITaskCreateBody }>('/tasks', async function (request, reply) {
    const task = await prisma.task.create({ data: { title: request.body.title } })

    await reply.code(201).send(task)
  })

  fastify.get<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    return await prisma.task.findUnique({ where: { id: +request.params.id } })
  })

  fastify.put<{ Params: ITaskParams, Body: ITaskUpdateBody }>('/tasks/:id', async function (request, reply) {
    return await prisma.task.update({ where: { id: +request.params.id }, data: request.body })
  })

  fastify.delete<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    await prisma.task.delete({ where: { id: +request.params.id } })

    await reply.code(204).send()
  })
}

export default tasks
