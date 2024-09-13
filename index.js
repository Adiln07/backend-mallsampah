import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";
import cors from "cors"
import ArticleRoute from "./routes/ArticleRoute.js"
import db from "./config/Database.js"
import UserRoute from "./routes/UserRoute.js" 

dotenv.config()
const app = express();
app.use(cors({credentials:true, origin:'http://localhost:5173'}));
app.use(express.json())
app.use(FileUpload())
app.use(express.static("public"))
app.use(ArticleRoute)

try {
    await db.authenticate();
    console.log('Database Connected...')
} catch (error) {
    console.error(error);
}

app.use(cookieParser())
app.use(express.json())
app.use(UserRoute)

app.listen(5000, ()=> console.log("Server up and Running..."))