import { describe, test } from 'node:test'
import * as assert from 'node:assert'
import { build } from '../helper.js'
import { Task } from '../../src/routes/tasks.js'

void describe('tasks route', async (s) => {
  void describe('GET /tasks', () => {
    void test('returns 200 ok', async (t) => {
      const app = await build(t)

      const res = await (app as any).inject({ method: 'GET', url: '/tasks' })
      assert.strictEqual(res.statusCode, 200)

      const tasks = JSON.parse(res.payload)
      assert.strictEqual(tasks.length, 4)
      tasks.forEach((task: Task) => {
        assert.strictEqual(typeof task.id, 'number')
        assert.strictEqual(typeof task.title, 'string')
        assert.strictEqual(typeof task.done, 'boolean')
      })
    })
  })

  void describe('GET /tasks/:id', () => {
    void describe('when specified task exists', () => {
      const id = 1

      void test('returns 200 ok', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'GET', url: `/tasks/${id}` })
        assert.strictEqual(res.statusCode, 200)

        const task = JSON.parse(res.payload)
        console.log(task)
        assert.strictEqual(task.id, 1)
        assert.strictEqual(task.title, 'Task 1')
        assert.strictEqual(task.done, false)
      })
    })

    void describe('when specified task does not exist', () => {
      const id = 10

      void test('returns 404 not found', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'GET', url: `/tasks/${id}` })
        assert.strictEqual(res.statusCode, 404)

        const error = JSON.parse(res.payload)
        assert.strictEqual(error.message, 'Task not found')
      })
    })
  })

  void describe('POST /tasks', () => {
    void describe('when specified title is not valid', () => {
      const title = ''

      void test('returns 400 bad request', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'POST', url: '/tasks', payload: { title } })
        assert.strictEqual(res.statusCode, 400)

        const error = JSON.parse(res.payload)
        assert.strictEqual(error.message, 'Task title does not allow empty')
      })
    })

    void describe('when specified title is valid', () => {
      const title = 'New Task'

      void test('returns 201 created', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'POST', url: '/tasks', payload: { title } })
        assert.strictEqual(res.statusCode, 201)

        const task = JSON.parse(res.payload)
        assert.strictEqual(typeof task.id, 'number')
        assert.strictEqual(task.title, title)
        assert.strictEqual(task.done, false)
      })
    })
  })

  void describe('PUT /tasks/:id', () => {
    void describe('when specified task does not exist', () => {
      const id = 10

      void test('returns 404 not found', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'PUT', url: `/tasks/${id}` })
        assert.strictEqual(res.statusCode, 404)

        const error = JSON.parse(res.payload)
        assert.strictEqual(error.message, 'Task not found')
      })
    })

    void describe('when specified task exists', () => {
      const id = 1

      void describe('and specified title is not valid', () => {
        const title = ''

        void test('returns 400 bad request', async (t) => {
          const app = await build(t)

          const res = await (app as any).inject({ method: 'PUT', url: `/tasks/${id}`, payload: { title } })
          assert.strictEqual(res.statusCode, 400)

          const error = JSON.parse(res.payload)
          assert.strictEqual(error.message, 'Task title does not allow empty')
        })
      })

      void describe('and specified title is valid', () => {
        const title = 'New Task'

        void test('returns 200 ok', async (t) => {
          const app = await build(t)

          const res = await (app as any).inject({ method: 'PUT', url: `/tasks/${id}`, payload: { title } })
          assert.strictEqual(res.statusCode, 200)

          const task = JSON.parse(res.payload)
          assert.strictEqual(task.id, id)
          assert.strictEqual(task.title, title)
          assert.strictEqual(task.done, false)
        })
      })
    })
  })

  void describe('DELETE /tasks/:id', () => {
    void describe('when specified task does not exist', () => {
      const id = 10

      void test('returns 404 not found', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'DELETE', url: `/tasks/${id}` })
        assert.strictEqual(res.statusCode, 404)

        const error = JSON.parse(res.payload)
        assert.strictEqual(error.message, 'Task not found')
      })
    })

    void describe('when specified task exists', () => {
      const id = 1

      void test('returns 204 no content', async (t) => {
        const app = await build(t)

        const res = await (app as any).inject({ method: 'DELETE', url: `/tasks/${id}` })
        assert.strictEqual(res.statusCode, 204)
        assert.equal(res.payload, '')
      })
    })
  })
})
