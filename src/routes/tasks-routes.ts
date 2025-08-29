import { TasksController } from "../controllers/tasks-controller"
import { Router } from "express"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const tasksRoutes = Router()
const tasksController = new TasksController()

tasksRoutes.post(
  "/", 
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  tasksController.create)

tasksRoutes.get(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  tasksController.show
)

tasksRoutes.delete(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  tasksController.remove
)

tasksRoutes.patch(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  tasksController.update
)

export { tasksRoutes }