import { Request, Response } from "express"
import { z } from "zod"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"

export class TeamMembersController {
  async create(req: Request, res: Response){
    const bodySchema = z.object({
      user_id: z.string(),
      team_id: z.string()
    })

    const { user_id, team_id } = bodySchema.parse(req.body)

    const userExists = await prisma.user.findFirst({ where: { id: user_id }})

    if(!userExists) {
      throw new AppError("user not found")
    }

    const teamExists = await prisma.team.findFirst({where: {id: team_id}})

    if(!teamExists) {
      throw new AppError("team not found")
    }

    const userAlreadyInTeam = await prisma.teamMember.findFirst({
      where: { userId: user_id, teamId: team_id }
    })

    if(userAlreadyInTeam) {
      throw new AppError("this user is already in the team")
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        userId: user_id,
        teamId: team_id
      }
    })

    return res.status(201).json(teamMember)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const teamMembers = await prisma.teamMember.findMany({
      select: {
        team: {
          select: {
            id: true,
            name: true
          }
        },
        user: {
          select: {
            id:true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      where: { teamId: id }
    })

    return res.json(teamMembers)
  }

  async remove(req: Request, res: Response){
    const { teamId, userId } = req.params

    const userIsOnTeam = await prisma.teamMember.findFirst({ 
      where: { 
        teamId: teamId,
        userId: userId
      }
    })

    if(!userIsOnTeam) {
      throw new AppError("user not found")
    }

    const removedMember = await prisma.teamMember.delete({where: {id: userIsOnTeam.id}})

    return res.status(200).json()
  }
}