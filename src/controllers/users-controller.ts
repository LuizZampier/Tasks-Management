import { Request, Response } from "express"
import { z } from "zod"
import { hash } from "bcrypt"
import { prisma } from "../database/prisma"
import { AppError } from "../utils/AppError"
import { UserRole } from "@prisma/client"

export class UsersController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(3),
      email: z.string().email(),
      password: z.string().min(6),
      role: z.enum(["admin", "member"])
    })

    const { name, email, password, role } = bodySchema.parse(req.body)

    const userWithSameEmail = await prisma.user.findFirst({where: { email }})

    if(userWithSameEmail) {
      throw new AppError("User with same email already exists")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name, 
        email,
        password: hashedPassword,
        role
      }
    })

    const { password: _, ...userWithoutPassword} = user

    return res.status(201).json(userWithoutPassword)
  }

  async update(req: Request, res: Response) {
    const bodySchema = z.object({
      role: z.enum(["member", "admin"])
    })

    const { role } = bodySchema.parse(req.body)

    const { id } = req.params

    const userExists = await prisma.user.findFirst({where: { id }})

    if(!userExists) {
      throw new AppError("user not found")
    }

    if(userExists.role === role as UserRole) {
      throw new AppError("attributed value is equal than the original")
    }

    const updatedRole = await prisma.user.update({
      data: {
        role: role as UserRole
      },
      where: {id}
    })

    return res.json(updatedRole)
  }
}