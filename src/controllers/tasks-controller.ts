import { Request, Response } from "express"
import { string, z } from "zod"

import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"
import { TaskStatus } from "@prisma/client"

export class TasksController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      title: z.string(),
      description: z.string(),
      status: z.enum(["pending", "in_progress", "completed"]),
      priority: z.enum(["high", "medium", "low"]),
      assigned_to: z.string(),
      team_id: z.string()
    })

    const { title, description, status, priority, assigned_to, team_id } = bodySchema.parse(req.body)
    
    const teamExists = await prisma.teamMember.findFirst({
      where: {
        teamId: team_id
      }
    })
    
    if(!teamExists) {
      throw new AppError("team not found")
    }

    const currentUserExistsOnTeam = await prisma.teamMember.findFirst({ where: { userId: req.user?.id }})

    if(!currentUserExistsOnTeam) {
      throw new AppError("you are not in this team")
    }

    const userExists = await prisma.teamMember.findFirst({
      where: {
        id: teamExists.id,
        userId: assigned_to
      }
    })

    if(!userExists) {
      throw new AppError("user not found")
    }

    const task = await prisma.task.create({
      data: {
        title: title,
        description: description,
        status: status,
        priority: priority,
        assignedTo: assigned_to,
        teamId: team_id
      }
    })

    const taskHistory = await prisma.taskHistory.create({
      data: {
        taskId: String(task.id),
        changedBy: String(req.user?.id),
        oldStatus: task.status,
        newStatus: task.status
      }
    })

    return res.json(task)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params

    const teamExists = await prisma.teamMember.findFirst({
      where: {
        teamId: id
      }
    })

    if(!teamExists) {
      throw new AppError("team not found")
    }

    const tasks = await prisma.task.findMany({
      where: {
        teamId: id
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        assignedTo: true,
        teamId: true,

        user: {
          select: {
            name: true
          }
        },

        team: {
          select: {
            name: true
          }
        }
      }
    })

    return res.json(tasks)
  }

  async remove(req: Request, res: Response) {
    const { id } = req.params

    const taskExists = await prisma.task.findFirst({where: { id }})

    if(!taskExists) {
      throw new AppError("task not found")
    }

    const currentUserExistsOnTeam = await prisma.teamMember.findFirst({ where: { userId: req.user?.id }})

    if(!currentUserExistsOnTeam) {
      throw new AppError("you are not in this team")
    }

    const taskRemoved = await prisma.task.delete({
      where: {
        id
      }
    })

    return res.status(200).json()
  }

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
      assigned_to: z.string().optional()
    })

    const { title, description, status, priority, assigned_to } = bodySchema.parse(req.body)

    const { id } = req.params

    const taskExists = await prisma.task.findFirst({where: { id }})

    if(!taskExists) {
      throw new AppError("task not found")
    }
    
    const memberExists = await prisma.user.findFirst({where: { id: assigned_to }})

    if(!memberExists) {
      throw new AppError("user not found")
    }

    const currentUserExistsOnTeam = await prisma.teamMember.findFirst({ where: { userId: req.user?.id }})

    if(!currentUserExistsOnTeam) {
      throw new AppError("you are not in this team")
    }
    
    const taskUpdated = await prisma.task.update({
      data: {
        title, 
        description, 
        status, 
        priority, 
        assignedTo: assigned_to
      },
      where: { id }
    })

    const taskHistory = await prisma.taskHistory.create({
      data: {
        taskId: taskExists.id,
        changedBy: String(req.user?.id),
        oldStatus: taskExists.status,
        newStatus: status as TaskStatus
      }
    })

    return res.status(200).json(taskUpdated)
  }
}