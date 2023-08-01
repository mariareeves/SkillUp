const bcrypt = require('bcrypt')


module.exports = {
    signup: (req, res) => {
        const { email, password } = req.body
        console.log('signup', email, password)
    }
}