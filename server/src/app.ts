
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoute from "./routes/analyze"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.use("/analyze", analyzeRoute); 

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
