// require dotenv package
require('dotenv').config
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
    seed: (req, res) => {
        sequelize.query(`
            drop table if exists practice;
            drop table if exists favoritescards;
            drop table if exists flashcards;
            
            create type flashcard_category as enum('behavioral', 'technical');
            create table flashcards (
                flashcard_id serial primary key,
                question varchar(300),
                answer text,
                category flashcard_category,
                created_date date
            );

            insert into flashcards(question, answer, category, created_date)
            values('Tell me about yourself', 'I am Maria, I am from Brazil, I am studying to be a Software Engineer', 'behavioral', '2023-07-24'), ('just test', 'test', 'technical','2023-08-01')
            
            ;
        `).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    },
    getCards: (req, res) => {
        sequelize.query('select * from flashcards order by created_date desc;')
            .then(dbRes => {
                console.log('I am in the getCards', dbRes[0])
                res.status(200).send(dbRes[0])
            })
            .catch(err => {
                console.log(err)
                res.status(500).send(err)
            })
    },
    createCards: (req, res) => {
        const { question, answer, category } = req.body;

        // Ensure the category is one of the allowed enum values
        const allowedCategories = ['behavioral', 'technical'];
        if (!allowedCategories.includes(category)) {
            return res.status(400).send("Invalid category. Allowed values are 'behavioral' and 'technical'.");
        }

        const created_date = new Date().toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format
        const newAnswer = answer.replace("'", "''") // replace the single quotes to two single quotes bc sql does not accept single quotes in the middle of the string
        sequelize.query(`
            INSERT INTO flashcards(question, answer, category, created_date)
            VALUES('${question}', '${newAnswer}', '${category}', '${created_date}')
            RETURNING *;
        `)
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
    }
}