import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// basic configurations
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true , limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser());

//cors configuration
app.use(
    cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials:true,
    methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"],
    })
);

//import the routes
import  healthCheckRouter  from "./routes/healthCheck.routes.js";
import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"
app.use("/api/v1/healthCheck",healthCheckRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/projects",projectRouter);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Global error handler: must be registered LAST and take 4 args
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    statusCode,
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.erros || [],
  });
});

export default app;

