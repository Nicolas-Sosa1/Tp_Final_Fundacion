import jwt, { decode } from 'jsonwebtoken'

const SECRET= process.env.SECRET;


const validateToken = (req, res, next)=>{
    const {token_user} = req.headers;
    jwt.verify(token_user, SECRET, (err, decoded) =>{
        if(err){
            return res.status(406).json({message: "Not allowed"});
        }
        req.infoUser = decoded;
        next()
    } )

}

export default validateToken;