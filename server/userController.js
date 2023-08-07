// require dotenv package
require('dotenv').config

const bcrypt = require('bcryptjs')
const { DB, USER, PASSWORD } = process.env

//require sequelize
const Sequelize = require('sequelize')

// instanciating a new Sequelize
const sequelize = new Sequelize(DB, USER, PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,
    pool: {
        max: 10,
        min: 0,
        acquire: 20000,
        idle: 5000
    }
})



module.exports = {
    signup: (req, res) => {
        const { email, password } = req.body
        console.log('signup', email, password)
        sequelize.query(`select * from flashcards_users where email = '${email}`)
            .then((dbRes) => {
                console.log(dbRes[0])
                if (dbRes[0][0]) {
                    return res.status(400).send('Email is already in use, try login')
                } else {
                    let salt = bcrypt.genSaltSync(10)
                    const passhash = bcrypt.hashSync(password, salt)
                    sequelize.query(`
                insert into from c(email, passhash) values('${email}', '${passhash}');
                select * from select * from where email = '${email}';
                `)
                        .then((dbResponse) => {
                            delete dbResponse[0][0].passhash;
                            const userToSend = { ...dbResponse[0][0] }
                            console.log('usertosend', userToSend)
                            res.status(200).send(userToSend);
                        }).catch(err => console.log(err))

                }
            })
            .catch(err => console.log(err))
    },
    login: (req, res) => {
        const { email, password } = req.body
        sequelize.query(`
        select * from select * from where email = '${email}';
        `)
            .then((dbRes) => {
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
                const userToSend = { ...dbRes[0][0] }
                res.status(200).send(userToSend)
            })
            .catch(err => console.log(err))
    }
}

