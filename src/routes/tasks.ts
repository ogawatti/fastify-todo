import { FastifyPluginAsync } from 'fastify'

interface ITaskParams {
  id: string
}

interface ITaskCreateBody {
  title: string
}

interface ITaskUpdateBody extends ITaskCreateBody {
  done: boolean
}

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/tasks', async function (request, reply) {
    return [
      { id: 1, title: 'Task 1', done: false },
      { id: 2, title: 'Task 2', done: false },
      { id: 3, title: 'Task 3', done: false },
      { id: 4, title: 'Task 4', done: true }
    ]
  })

  fastify.post<{ Body: ITaskCreateBody }>('/tasks', async function (request, reply) {
    const { title } = request.body

    reply.code(201).send({ id: 5, title, done: false })
  })

  fastify.put<{ Params: ITaskParams, Body: ITaskUpdateBody }>('/tasks/:id', async function (request, reply) {
    const id = request.params.id
    const { title, done } = request.body

    return {
      id,
      title: title || 'Task 5',
      done: done || false
    }
  })

  fastify.delete<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    const id = request.params.id
    console.log(`Deleting task ${id}`)

    reply.code(204).send()
  })
}

export default tasks
