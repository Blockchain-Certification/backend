import { Router } from "express";

import { manage } from "./manage";
import { studentDAC } from "./student";
const router = Router();



router.use('/manage', manage);
router.use('/student', studentDAC);

export default router;