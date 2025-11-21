import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const userShema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required : [true, "El nombre del usuario es obligatorio"],
            minlength:[3, "El nombre debe tener al menos 3 caracteres"]
        },
        lastName: {
            type: String,
            required : [true, "El apellido del usuario es obligatorio"],
            minlength:[3, "El apellido debe tener al menos 3 caracteres"]
        },
        email:{
            type:String,
            required : [true, "El correo electrónico es obligatorio"],
            unique: true
        },
        password:{
            type: String,
            required : [true, "La contraseña es obligatoria"],
            minlength: [8, "La contraseña debe tener al menos 8 caracteres"]
        }

    }, {timestamps:true}
)

//metodo virtual 
userShema.virtual('passwordConfirmation').get(
    function(){
        return this._passwordConfirmation;

    }
).set(function(value){
    this._passwordConfirmation = value;

});

userShema.pre('validate', function(next){
    if(this.password !== this._passwordConfirmation){
        this.invalidate('passwordConfirmation', "La contraseña y la confirmación de la contraseña no coinciden");
    }
    next();
})


//metodo de hash para proteger password
userShema.pre('save', function(next){
    bcrypt.hash(this.password, 10).then((ecnryptedPass)=>{
        this.password = ecnryptedPass;
        next();
    })
})

const User = mongoose.model("users", userShema);

export {User, userShema};