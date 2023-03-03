import { Router } from "express";

import { student } from "./student";
import { university } from "./university";
const router = Router();



router.use('/students', student);
router.use('/universities', university);

export default router;