import { Request, Response } from "express"
import { z } from "zod"
import { AppError } from "../utils/AppError"
import { prisma } from "../database/prisma"

export class TeamsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().min(3),
      description: z.string().optional().nullable()
    })

    const { name, description } = bodySchema.parse(req.body)

    const teamNameAlreadyExists = await prisma.team.findFirst({where: {name}})

    if(teamNameAlreadyExists) {
      throw new AppError("this team name already exists")
    }

    const team = await prisma.team.create({
      data: {
        name, 
        description
      }
    })

    return res.status(201).json(team)
  }

  async index(req: Request, res: Response) {
    const teams = await prisma.team.findMany()

    return res.json({teams})
  }
}