//importar o client
//import the client
import {PrismaClient} from "@prisma/client";


//criar uma instância que será usada em todo o projeto para interagir
//com a base de dados através do prisma
//create an instance that will be used throughout the project to interact
//with the database through prisma
export const prisma = new PrismaClient();