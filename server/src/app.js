import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        exposedHeaders : ["Set-Cookie"],
    }
))

app.use(express.json())
app.use(cookieParser())


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });

import userRoutes from "./routes/user.routes.js"
import formRoutes from "./routes/form.routes.js"

app.use("/api/user" , userRoutes)
app.use("/api/forms" , formRoutes)


export {app}