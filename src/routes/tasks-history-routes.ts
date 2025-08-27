import { Router } from "express"
import { TasksHistoryController } from "../controllers/tasks-history-controller"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const tasksHistoryRoutes = Router()
const tasksHistoryController = new TasksHistoryController()

tasksHistoryRoutes.get(
  "/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  tasksHistoryController.show
)

export { tasksHistoryRoutes }