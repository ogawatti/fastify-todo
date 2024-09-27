import { Task } from "@prisma/client";
import { build } from "../helper";
import prisma from "../../src/lib/prisma";
import { IErrorResponse } from "../../src/routes/tasks";

describe('Task API', () => {
  const app = build();

  afterEach(async () => {
    await prisma.task.deleteMany();
  });

  describe('GET /tasks', () => {
    const url = '/tasks';

    beforeEach(async () => {
      await Promise.all(
        [...Array(3)].map(async (_, i) => {
          return await prisma.task.create({ data: { title: `test ${i + 1}` } });
        })
      );
    });

    it('returns 200 ok', async () => {
      const res = await app.inject({ url });

      expect(res.statusCode).toEqual(200);

      const body = res.json() as Task[];
      body.forEach(({ id, title, done }) => {
        expect(typeof id).toBe('number')
        expect(typeof title).toBe('string');
        expect(done).toBe(false);
      });
    });
  });

  describe('GET /tasks/:id', () => {
    describe('when specified task exists', () => {
      let task: Task;

      beforeEach(async () => {
        task = await prisma.task.create({ data: { title: 'test' } });
      });

      it('returns 200 ok', async () => {
        const res = await app.inject({ url: `/tasks/${task.id}` });

        expect(res.statusCode).toEqual(200);

        const body = res.json() as Task;
        expect(body.id).toBe(task.id);
        expect(body.title).toBe(task.title);
        expect(body.done).toBe(task.done);
      });
    });

    describe('when specified task does not exist', () => {
      it('returns 404 not found', async () => {
        const res = await app.inject({ url: '/tasks/0' });

        expect(res.statusCode).toEqual(404);

        const error = res.json() as IErrorResponse;
        expect(error.message).toBe('Task not found');
      });
    });
  });

  describe('POST /tasks', () => {
    const method = 'POST';
    const url = '/tasks';

    describe('when specified title is valid', () => {
      const title = 'test';

      it('returns 201 created', async () => {
        const res = await app.inject({ method, url, payload: { title } });

        expect(res.statusCode).toEqual(201);

        const body = res.json() as Task;
        expect(typeof body.id).toBe('number')
        expect(body.title).toBe('test');
        expect(body.done).toBe(false);
      });
    });

    describe('when specified title is not valid', () => {
      const title = '';

      it('returns 400 bad request', async () => {
        const res = await app.inject({ method, url, payload: { title } });

        expect(res.statusCode).toEqual(400);

        const error = res.json() as IErrorResponse;
        expect(error.message).toBe('Title is required');
      });
    });
  });

  describe('PUT /tasks/:id', () => {
    const method = 'PUT';

    describe('when specified task exists', () => {
      let task: Task;
      let url: string;

      beforeEach(async () => {
        task = await prisma.task.create({ data: { title: 'test' } });
        url = `/tasks/${task.id}`;
      });

      describe('and specified title is valid', () => {
        const title = 'updated';

        it('returns 200 ok', async () => {
          const res = await app.inject({ method, url, payload: { title } });

          expect(res.statusCode).toEqual(200);

          const body = res.json() as Task;
          expect(body.id).toBe(task.id);
          expect(body.title).toBe('updated');
          expect(body.done).toBe(task.done);
        });
      });

      describe('and specified title is not valid', () => {
        const title = '';

        it('returns 400 bad request', async () => {
          const res = await app.inject({ method, url, payload: { title } });

          expect(res.statusCode).toEqual(400);

          const error = res.json() as IErrorResponse;
          expect(error.message).toBe('Title is required');
        });
      });
    });

    describe('when specified task does not exist', () => {
      it('returns 404 not found', async () => {
        const res = await app.inject({ method, url: '/tasks/0' });

        expect(res.statusCode).toEqual(404);

        const error = res.json() as IErrorResponse;
        expect(error.message).toBe('Task not found');
      });
    });
  });

  describe('DELETE /tasks/:id', () => {
    describe('when specified task exists', () => {
      let task: Task;

      beforeEach(async () => {
        task = await prisma.task.create({ data: { title: 'test' } });
      });

      it('returns 204 no content', async () => {
        const res = await app.inject({ method: 'DELETE', url: `/tasks/${task.id}` });

        expect(res.statusCode).toEqual(204);
        expect(res.payload).toBe('');
      });
    });

    describe('when specified task does not exist', () => {
      it('returns 404 not found', async () => {
        const res = await app.inject({ method: 'DELETE', url: '/tasks/0' });

        expect(res.statusCode).toEqual(404);

        const error = res.json() as IErrorResponse;
        expect(error.message).toBe('Task not found');
      });
    });
  });
});
