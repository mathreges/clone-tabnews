import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";
const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInputData = request.body;
  const createdUser = await user.create(userInputData);
  return response.status(201).json(createdUser);
}
