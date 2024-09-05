import { FastifyPluginAsync, FastifyRequest } from 'fastify'

interface ITaskParams {
  id?: number
}

type TaskRequest = FastifyRequest<{
  Params: ITaskParams
}>

interface ITaskCreateBody {
  title: string
}

interface ITaskUpdateBody extends ITaskCreateBody {
  done: boolean
}

type Task = { id: number, title: string, done: boolean } | null

const tasks: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  let task: Task

  fastify.addHook('onRequest', async (request: TaskRequest, reply) => {
    const { id } = request.params
    if (id === undefined) return

    task = findTask(id)
    if (task == null) await reply.code(404).send({ message: 'Task not found' })
  })

  const findTask = (id: number): { id: number, title: string, done: boolean } | null => {
    return (id <= 0 || id >= 10) ? null : { id, title: `Task ${id}`, done: false }
  }

  // API Endpoints
  fastify.get('/tasks', async function (request, reply) {
    return [
      { id: 1, title: 'Task 1', done: false },
      { id: 2, title: 'Task 2', done: false },
      { id: 3, title: 'Task 3', done: false },
      { id: 4, title: 'Task 4', done: true }
    ]
  })

  fastify.get<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    return task
  })

  fastify.post<{ Body: ITaskCreateBody }>('/tasks', async function (request, reply) {
    const { title } = request.body

    await reply.code(201).send({ id: 5, title, done: false })
  })

  fastify.put<{ Params: ITaskParams, Body: ITaskUpdateBody }>('/tasks/:id', async function (request, reply) {
    return { ...task, ...request.body }
  })

  fastify.delete<{ Params: ITaskParams }>('/tasks/:id', async function (request, reply) {
    await reply.code(204).send()
  })
}

export default tasks
