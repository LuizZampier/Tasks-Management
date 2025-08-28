import { Router } from "express"
import { UsersController } from "../controllers/users-controller"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const usersRoutes = Router()
const usersController = new UsersController()

usersRoutes.post("/", usersController.create)
usersRoutes.patch("/:id", 
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  usersController.update)

export { usersRoutes }