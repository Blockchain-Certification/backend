import { Router } from "express";

import { student } from "./student";
const router = Router();



router.use('/students', student);

export default router;