import request from "supertest"

import { prisma } from "../database/prisma"

import { app } from "../app"

describe("TeamMemberController", () => {
  let user_id: string
  let team_id: string
  let team_member_id: string
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

    const teamCreation = await request(app)
    .post("/teams")
    .auth(token, {type: "bearer"})
    .send({
      name: "Test Member Team",
      description: "Test Description"
    })

    team_id = teamCreation.body.id
  })

  afterAll(async () =>{
    await prisma.user.delete({where: {id: user_id}})
    await prisma.team.delete({where: {id: team_id}})
    // await prisma.teamMember.delete({where: {id: team_member_id}})
  })

  it("should create a new team member successfully", async() => {
    const response = await request(app)
    .post("/team-members")
    .auth(token, {type: "bearer"})
    .send({
      userId: user_id,
      teamId: team_id
    })

    team_member_id = response.body.id

    expect(response.status).toBe(201)
  })
})