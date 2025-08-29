import request from "supertest"

import { prisma } from "../database/prisma"

import { app } from "../app"

describe("SessionsController", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({where: {id: user_id}})
  })

  it("should authenticated and get token access", async () => {
    const userResponse = await request(app)
    .post("/users")
    .send({
      name: "Test User",
      email: "testuser@email.com",
      password: "123456",
      role: "member"
    })

    user_id = userResponse.body.id

    const sessionsResponse = await request(app)
    .post("/sessions")
    .send({
      email: "testuser@email.com",
      password: "123456"
    })

    expect(sessionsResponse.status).toBe(200)
    expect(sessionsResponse.body.token).toEqual(expect.any(String))
  })
})