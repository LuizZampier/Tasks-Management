import { Router } from "express"
import { TeamMembersController } from "../controllers/team-members-controller"
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization"

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.post("/", 
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamMembersController.create
)

teamMembersRoutes.get("/:id/show", 
  ensureAuthenticated,
  verifyUserAuthorization(["admin", "member"]),
  teamMembersController.show
)

teamMembersRoutes.delete("/:id",
  ensureAuthenticated,
  verifyUserAuthorization(["admin"]),
  teamMembersController.remove
)

export{ teamMembersRoutes }