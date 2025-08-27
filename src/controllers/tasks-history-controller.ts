import { Request, Response } from "express"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"

export class TasksHistoryController {
  async show(req: Request, res: Response) {
    const { id } = req.params

    const taskExists = await prisma.task.findFirst({where: {id}})

    if(!taskExists) {
      throw new AppError("task not found")
    }

    const userExistsOnTeam = await prisma.teamMember.findFirst({
      where:
      {
        teamId: taskExists.teamId,
        userId: req.user?.id
      }
    })

    if(!userExistsOnTeam) {
      throw new AppError("you are not in this team")
    }

    const taskHistory = await prisma.taskHistory.findMany({
      where: {
        taskId: id
      }
    })

    return res.json(taskHistory)
  }
}