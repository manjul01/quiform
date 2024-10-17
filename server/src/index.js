import { app } from "./app.js";
import dotenv from "dotenv"
import { dbConnect } from "./db/index.js";

dotenv.config({
    path: './.env'
})

dbConnect()
    .then(()=> {
        console.log("------ database connected ------")
    })
    .catch(()=> {
        console.log("------- !!  error connecting to db  !!---");
    })


app.listen(process.env.PORT || 3000 , ()=> {
    console.log("listening on port ", process.env.PORT || 3000);
});