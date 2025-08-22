import { Router } from "express"
import { TeamsController } from "../controllers/teams-controller"

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const teamsRoutes = Router()
const teamsController = new TeamsController()

teamsRoutes.post("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]), 
  teamsController.create)

teamsRoutes.get("/",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]), 
  teamsController.index
)

export { teamsRoutes }