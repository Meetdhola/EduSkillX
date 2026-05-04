const userModel = require('../models/auth.model');

module.exports.createUser = async ({firstname, lastname, email, role, password}) => {
    if(!firstname || !lastname || !email || !role || !password){
        throw new Error('All fields are required');
    }
    const user = await userModel.create({
        Fullname:{
            firstname,
            lastname,
        },
        email,
        role,
        password,
    });
    return user;
}


