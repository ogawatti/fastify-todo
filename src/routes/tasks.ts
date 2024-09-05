import { FastifyPluginAsync } from 'fastify'

interface ITaskCreateBody {
  title: string
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
}

export default tasks
