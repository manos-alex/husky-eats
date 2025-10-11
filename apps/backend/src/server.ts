import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from './routes/index.js';
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js"

const app = express();
app.use(helmet());
app.use(cors({ origin:"*" }));
app.use(express.json());

app.use('/api', router);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`API on http://localhost:${port}`));