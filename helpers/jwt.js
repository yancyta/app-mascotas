const jwt = require('jsonwebtoken');
const generarJWT = (uid,email) => {
    const payload = {
        uid,
        email
    };
    return new Promise((resolve, reject) => {      
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error de JWT');
            } else {
              //  console.log(token);
                resolve(token);
            }
        });
    });

}
module.exports = {
    generarJWT
}