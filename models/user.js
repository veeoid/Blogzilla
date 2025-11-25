const {Schema, model} = require('mongoose');
const { createHmac, randomBytes, hash } = require('crypto');

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

userSchema.static('matchPassword', async function(email, password){
    console.log(email);
    const user = await this.findOne({email:email});
    console.log(user);
    
    if (!user){
        throw new Error('User not found');
    }

    console.log(user.firstName)
    const salt = user.salt;
    const hashedPassword = user.password;
    console.log(hashedPassword);
    const userProvidedHash = createHmac('sha256', salt).update(password).digest("hex");
    console.log(userProvidedHash);
    if (userProvidedHash !== hashedPassword) throw new Error('User not found');
    return user;
})


const User = model('user', userSchema);

module.exports = User;