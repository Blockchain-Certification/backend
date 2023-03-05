import { Router } from "express";

import { manage } from "./manage";
import { studentDAC } from "./student";
import { generalDAC } from "./general";
const router = Router();



router.use('/manage', manage);
router.use('/student', studentDAC);
router.use('/', generalDAC);

export default router;