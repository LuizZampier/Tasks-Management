import request from "supertest"
import { prisma } from "../database/prisma"

import { app } from "../app"

describe("TeamsController", () => {
  let user_id: string
  let team_id: string
  let token: string

  beforeAll(async () => {
    const userCreation = await request(app)
    .post("/users")
    .send({
      name: "Team Member Test",
      email: "TMT@email.com",
      password: "123456",
      role: "admin"
    })

    user_id = userCreation.body.id

    const sessionCreation = await request(app)
    .post("/sessions")
    .send({
      email: "TMT@email.com",
      password: "123456",
    })

    token = sessionCreation.body.token
  })

  afterAll(async () =>{
    await prisma.user.delete({where: {id: user_id}})
    await prisma.team.delete({where: {id: team_id}})
  })

  it("should create a new team successfully", async () => {
    const response = await request(app)
    .post("/teams")
    .auth(token, {type: "bearer"})
    .send({
      name: "Team Name",
      description: "Optional Description"
    })

    team_id = response.body.id

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
  })
})