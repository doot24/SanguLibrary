
import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";
import { body, validationResult } from "express-validator";
import { CategorySchema } from "../../schemas/CategorySchema";

router.post('/add', IsAuthenticated, HasRoles(["admin", "editor"]), body("text").notEmpty().isString(), body("index").notEmpty().isString(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  try {
    let result : any = await CategorySchema.findOne({index : req.body.index});

    if(result)
    {
      return res.status(400).json({ status: "fail", message: "მოცემული კატეგორია უკვე არსებობს!" });
    }

    await new CategorySchema({index : req.body.index, text : req.body.text}).save();

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/delete', IsAuthenticated, HasRoles(["admin", "editor"]), body("index").notEmpty().isString(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  try {
    await CategorySchema.findOneAndDelete({index : req.body.index});

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.get('/', IsAuthenticated, HasRoles(["admin", "editor"]), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  try {
    let result : any = await CategorySchema.find();

    res.status(200).json({ status: "success", categories : result });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});
export default router;
