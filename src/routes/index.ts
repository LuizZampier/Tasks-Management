import { Router } from "express";

import { usersRoutes } from "./users-routes"
import { sessionsRoutes } from "./sessions-routes"
import { teamsRoutes } from "./teams-routes"
import { teamMembersRoutes } from "./team-members-routes"
import { tasksRoutes } from "./tasks-routes"
import { tasksHistoryRoutes } from "./tasks-history-routes"

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/teams", teamsRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/tasks", tasksRoutes)
routes.use("/tasks-history", tasksHistoryRoutes)

export { routes }