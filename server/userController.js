// require dotenv package
require('dotenv').config

const bcrypt = require('bcryptjs')
const { CONNECTION_STRING, SECRET } = process.env
const jwt = require("jsonwebtoken")

//create a token using jwt
const createToken = (email, id) => {
    return jwt.sign(
        {
            email,
            id,
        },
        SECRET,
        {
            expiresIn: "2 days",
        }
    );
};


//require sequelize
const Sequelize = require('sequelize')

// instanciating a new Sequelize
const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})


module.exports = {
    signup: (req, res) => {
        const { email, password } = req.body
        console.log('signup', email, password)
        sequelize.query(`select * from flashcards_users where email = '${email}';`)
            .then((dbRes) => {
                console.log(dbRes[0])
                if (dbRes[0][0]) {
                    return res.status(400).send('Email is already in use, try login')
                } else {
                    let salt = bcrypt.genSaltSync(10)
                    const passhash = bcrypt.hashSync(password, salt)
                    sequelize.query(`
                insert into flashcards_users (email, passhash) values('${email}', '${passhash}');
                select * from flashcards_users where email = '${email}';
                `)
                        .then((dbResponse) => {
                            delete dbResponse[0][0].passhash;
                            const token = createToken(email, dbResponse[0][0].flashcard_user_id)
                            console.log("token", token)
                            const userToSend = { ...dbResponse[0][0], token }
                            console.log('usertosend', userToSend)
                            res.status(200).send(userToSend);
                        }).catch(err => console.log(err))

                }
            })
            .catch(err => console.log(err))
    },
    login: (req, res) => {
        const { email, password } = req.body
        console.log('login line 72', email, password)
        sequelize.query(`
        select * from flashcards_users where email = '${email}';
        `)
            .then((dbRes) => {
                console.log('line 77', dbRes[0])
                if (!dbRes[0][0]) {
                    return res.status(200).send('Account not found, try signing up')
                }
                const authenticated = bcrypt.compareSync(
                    password,
                    dbRes[0][0].passhash
                )
                if (!authenticated) {
                    res.status(403).send('incorrect password')
                }
                delete dbRes[0][0].passhash;
                const token = createToken(email, dbRes[0][0].flashcard_user_id);
                console.log("token line 90", token)
                console.log('line 91', dbRes[0][0])
                const userToSend = { ...dbRes[0][0], token }
                console.log('line 93', userToSend)
                res.status(200).send(userToSend)
            })
            .catch(err => console.log(err))
    },

}

