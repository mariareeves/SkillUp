// require dotenv package
require('dotenv').config
const { CONNECTION_STRING } = process.env


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
    seed: (req, res) => {
        sequelize.query(`
            drop table if exists flashcards;
            drop table if exists flashcards_users;
            
            create type flashcard_category as enum('behavioral', 'technical');
            create table flashcards_users (
                flashcards_users_id serial primary key,
                email varchar not null,
                passhash varchar(500) not null
            );
            create table flashcards (
                flashcard_id serial primary key,
                question varchar(300),
                answer text,
                category flashcard_category,
                created_date date,
                favoriteCard boolean default false,
                user_id integer references flashcards_users(flashcards_users_id)
            );
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },
    getCards: (req, res) => {
        const user_id = req.query.user_id
        console.log('line 48 user_id', user_id)
        sequelize.query(`select * from flashcards where user_id = ${user_id} order by created_date desc;`)
            .then(dbRes => {
                // console.log('I am in the getCards', dbRes[0])
                res.status(200).send(dbRes[0])
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(err)
            })
    },
    createCards: (req, res) => {
        const { question, answer, category, user_id } = req.body;
        console.log('userid created', user_id)

        // Ensure the category is one of the allowed enum values
        const allowedCategories = ['behavioral', 'technical'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).send("Invalid category. Allowed values are 'behavioral' and 'technical'.");
        }
        //parameterized queries to accept single quotes
        const created_date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
        const newAnswer = answer.replace("'", "''") // replace the single quotes to two single quotes bc sql does not accept single quotes in the middle of the string
        // bind provides values that need to be bound to the placeholders ($1, $2, etc.) in the SQL query.
        //type contains the values that will replace the placeholders in the SQL query. 
        sequelize.query(`
    INSERT INTO flashcards(user_id, question, answer, category, created_date)
    VALUES($1, $2, $3, $4, $5)
    RETURNING *;
`, {
            bind: [user_id, question, newAnswer, category, created_date],
            type: sequelize.QueryTypes.INSERT
        })

            .then(dbRes => {
                res.status(201).send(dbRes[0]);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Failed to create the flashcard.");
            });
    },
    deleteCard: (req, res) => {
        const { id } = req.params
        sequelize.query(`
            delete from flashcards
            where flashcard_id = ${id};
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0]);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Failed to delete the flashcard.");
            });

    },
    updateCard: (req, res) => {
        let { question, answer } = req.body
        console.log('essa e minha nova question: ', question)
        console.log('essa e a minha nova answer: ', answer)
        let { id } = req.params
        console.log('essa e a minha id', id)

        sequelize.query(`
            update flashcards set
            question = '${question}',
            answer = '${answer}'
            where flashcard_id = ${id};
        `)
            .then(dbRes => res.sendStatus(200))
            .catch(err => console.log(err))
    },
    getOneCard: (req, res) => {
        const { id } = req.params
        sequelize.query(`
            select * from flashcards
            where flashcard_id = ${id};
        `)
            .then(dbRes => {
                res.status(200).send(dbRes[0]);
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Failed to  getOne card the flashcard.");
            });
    },
    favoriteCard: (req, res) => {
        let { favoritecard } = req.body
        console.log('inside favoriteCard', favoritecard)
        let { id } = req.params
        console.log('req.body', id)
        console.log('essa e a minha nova favoriteCard: ', favoritecard);

        sequelize.query(`
            update flashcards set favoritecard= ${favoritecard}
            where flashcard_id = ${id};
        `)
            .then(dbRes => res.sendStatus(200))
            .catch(err => console.log('error updating favoriteCard', err))
    },
    getFavoriteCards: (req, res) => {
        const user_id = req.query.user_id
        console.log('user favorite card', user_id)
        sequelize.query(`select * from flashcards where user_id=${user_id} and favoritecard = true;`)
            .then(dbRes => {
                console.log('I am in the getFavoriteCards', dbRes[0])
                res.status(200).send(dbRes[0])
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(err)
            })
    },

}