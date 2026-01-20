import { Router } from "express";
import { User } from "../interfaces/users";

const router = Router();

const users: User[] = [];

router.get("/", (req, res) => {
  res.json(users);
});

export default router;
