import { FastifyPluginAsync, FastifyRequest } from 'fastify'
import prisma from '../lib/prisma'
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

export interface IErrorResponse {
  message: string;
}

const taskNotFound: IErrorResponse = { message: 'Task not found' };
const taskTitleIsRequired: IErrorResponse = { message: 'Title is required' };

type TaskRequest = FastifyRequest<{
  Params: ITaskParams
  Body: ITaskCreateBody | ITaskUpdateBody
}>

const tasks: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.addHook('onRequest', async (request: TaskRequest, reply) => {
    if ((request.raw.url?.match(/^\/tasks\/+\d/))) {
      const id = +request.params.id
      const task = await prisma.task.findUnique({ where: { id } })

      if (!task) return reply.code(404).send(taskNotFound)
    }
  });

  fastify.addHook('preValidation', async (request: TaskRequest, reply) => {
    if (
      (request.raw.url?.match(/^\/tasks/)) && request.method === 'POST' && request.body?.title === '' ||
      (request.raw.url?.match(/^\/tasks\/+\d/)) && request.method === 'PUT' && request.body?.title === ''
    ) {
      return reply.code(400).send(taskTitleIsRequired)
    }
  })

  fastify.get('/tasks', async function (): Promise<Array<Prisma.TaskGetPayload<object>>> {
    return await prisma.task.findMany({ where: { done: false } })
  })

  fastify.get<{ Params: ITaskParams }>('/tasks/:id', async function (request) {
    return await prisma.task.findUnique({ where: { id: +request.params.id } })
  })

  fastify.post<{ Body: ITaskCreateBody }>('/tasks', async function (request, reply) {
    const title = request.body.title;
    const task = await prisma.task.create({ data: { title } })
    await reply.code(201).send(task)
  })

  fastify.put<{ Params: ITaskParams, Body: ITaskUpdateBody }>('/tasks/:id', async function (request) {
    return await prisma.task.update({ where: { id: +request.params.id }, data: request.body })
  })

  fastify.delete<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    await prisma.task.delete({ where: { id: +request.params.id } })

    await reply.code(204).send()
  })
}

export default tasks
