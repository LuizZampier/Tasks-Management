import request from "supertest"
import { prisma } from "../database/prisma"

import { app } from "../app"

describe("UsersController", () => {
  let user_id: string

  afterAll(async () => {
    await prisma.user.delete({where: {id: user_id}})
  })

  it("should create a new user successfully", async () => {
    const response = await request(app)
    .post("/users")
    .send({
      name: "Auth Test User",
      email: "auth_test_user@email.com",
      password: "123456"
    })
    user_id = response.body.id

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Auth Test User")
  })

  it("should throw an error if user with same email already exists", async () => {
    const response = await request(app)
    .post("/users")
    .send({
      name: "Duplicated User",
      email: "auth_test_user@email.com",
      password: "123456"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User with same email already exists")
  })

  it("should throw a validation error if email is invalid", async () => {
    const response = await request(app)
    .post("/users")
    .send({
      name: "Test User",
      email: "invalid-email",
      password: "123456"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("validation error")
  })

  it("should throw a validation error if password is invalid", async () => {
    const response = await request(app)
    .post("/users")
    .send({
      name: "Test User",
      email: "invalid-email@email.com",
      password: "123"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("validation error")
  })
})