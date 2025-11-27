//importar bibliotecas
//import libraries
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

//importar rotas
//import routers
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import libraryRouter from "./routes/library.routes.js";
import commentRouter from "./routes/comments.routes.js";
import mediaRouter from "./routes/media.routes.js";


//importar middleware global de tratamento de erros
//import middleware global error handler
import { errorHandler } from "./middlewares/errorHandler.js";


//carregar variaveis de ambiente
//load environment variables
dotenv.config()


//criar server express
//create express server
const app = express();


//middleware que permite receber os dados em formato JSON
//middleware to allow receiving data in JSON format
app.use(express.json())


//configurar cors (permitir coms entre frontend e backend)
//perspetiva para o futuro para implementar frontend neste projeto
//configure cors (allow comms between frontend and backend)
//perspective for the future to implement frontend in this project
app.use(
    cors( {
        origin: "http://localhost:5173",
        credentials: true,
    })
)


//rotas PRINCIPAIS
//MAIN routes
//autenticação e gestão de utilizadores
//authentication and user management
app.use("/api/v1/auth", authRouter); //rotas de login e registo
app.use("/api/v1/users", userRouter); //rotas de users

//gestão de filmes/series, biblioteca pessoal e comentários
//management of movies/series, personal library and comments
app.use("/api/v1/media", mediaRouter); //rotas de filmes/series
app.use("/api/v1/library", libraryRouter); //rotas da biblioteca pessoal
app.use("/api/v1/comments", commentRouter); //rotas de comentários



//rota base
//base route
app.get("/", (req, res) =>{
    res.send("FILMES e SÉRIES API")
});


//middleware erros globais
//global error handling middleware
app.use(errorHandler);


//arrancar o servidor
//start the server
app.listen(process.env.PORT, () => {
    console.log(`Servidor a correr em: http://localhost:${process.env.PORT}`)
})