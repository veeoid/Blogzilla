const {Schema, model} = require('mongoose');
const { createHmac, randomBytes, hash } = require('crypto');
const {createTokenForUser, validateToken} = require('../services/authentication')

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unqiue: true,
    },
    email: {
        type: String,
        required: true,
        unqiue: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
        unqiue: true,   
    },
    profileImageURL: {
        type: String,
        default: './images/default_user.png',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    }
}, {timestamps: true}
)

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified("password")) return;
    
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;
    
});

userSchema.static('matchPasswordAndGenerateToken', async function(email, password){
    const user = await this.findOne({email:email});

    if (!user){
        throw new Error('User not found');
    }

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");

    if (userProvidedHash !== hashedPassword) throw new Error('User not found');
    
    const token = createTokenForUser(user);
    return token
})

const User = model('user', userSchema);

module.exports = User;