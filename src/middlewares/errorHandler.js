//middleware generico para tratar dos erros
//generic middleware to handle errors

export function errorHandler(err, req, res, next){
    console.error("Err: ", err);
    res.status(500).json({err:"Error internal server" })
}