import { Router, Request, Response } from "express";
import { analyzeCode } from "../services/mistralService";

const router = Router();

router.post("/", async (req: Request, res: Response): Promise<any> => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Solidity code is required." });
  }

  try {
    const result = await analyzeCode(code);
    res.json(result);
  } catch (error) {
    console.error("Mistral error:", error);
    res.status(500).json({ error: "Failed to analyze contract." });
  }
});

export default router;
