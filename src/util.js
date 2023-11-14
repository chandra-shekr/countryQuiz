"use strict";
import pg from "pg"
import fs from "fs";


const db = new pg.Client({
    user: process.env.PDB_USER,
    host: process.env.PDB_HOST,
    database: process.env.PDB,
    password: process.env.PDB_PASS
})



db.connect()
    .then(res => console.debug("DB connected"))
    .catch(err => console.error(err.message))


const question = async (file) => {

    try {

        const query = fs.readFileSync(file, { encoding: 'utf8' })
        const rows = await db.query(query)
        return rows
    } catch (err) {

        return err.message

    }

}

const verifyAnswer = (original, answer) => {

    return original.toLowerCase().trim() === answer.toLowerCase().trim()
}

const computeScore = (prevScore, currentResp) => {

    let score = parseInt(prevScore)
    return currentResp ? (++score) : score
}

export default db
export { question, verifyAnswer, computeScore }