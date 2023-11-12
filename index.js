"use strict";
import dotenv from "dotenv/config"
import express, { application } from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"
import { join, dirname } from "path"
import { randomUUID } from "crypto"
import db, { question, verifyAnswer, computeScore } from "./src/util.js"


const __dirname = join(dirname(fileURLToPath(import.meta.url)), "public")
const app = express()
const port = process.env.PORT || 3900
const server = app.listen(port, () => { console.debug("Listening to port: ", port) })
const appinfo = {
    year: new Date().getFullYear()
}
const cookieConfig = {

    httpOnly: true,
    secure: false, //! MAKE SURE TO CHAGE IT TO 'true' during deployment
    maxAge: 60 * 1000,
    signed: true
}



//---------------Middlewear------------------------

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ type: ['application/json', 'text/*'] }))
app.use(cors())
app.use(cookieParser('g@rgleBl@st3r'))
app.set('view engine', 'ejs')

app.use((req, res, next) => {

    if (!req.signedCookies.id) {

        res.cookie('id', randomUUID(), cookieConfig)
        res.cookie('score', 0, cookieConfig)
        res.cookie('reset', false, cookieConfig)

    }
    next()

})

//---------------------------------------------------

app.get("/", async (req, res) => {

    let newsession = req.signedCookies.id ? false : true
    let reset = /true/.test(req.signedCookies.reset) ? true : false
    let score = parseInt(req.signedCookies.score) || 0
    let q = await question()

    if (reset) {
        score = 0
        res.cookie('reset', false, cookieConfig)
    }
    res.status(200).render("index", {
        appinfo: appinfo,
        game: {
            data: {
                score: score,
                ...q.rows[0]
            },
            newsession: newsession,
            reset: reset,
        }
    })



})

app.post("/", async (req, res) => {
    let response = verifyAnswer(req.body.original, req.body.answer)
    let score = computeScore(req.signedCookies.score, response)
    let q = await question()
    res.cookie("score", score, cookieConfig)
    res.status(200).render("index", {
        appinfo: appinfo,
        game: {
            data: {
                score: score,
                ...q.rows[0],
                response: response
            },
            newsession: false,
            reset: false,
        }
    })


})



app.get("/reset", (req, res) => {

    res.cookie("score", 0, cookieConfig)
    res.cookie("reset", true, cookieConfig)
    res.status(301).redirect("/")


})



const cleanup = () => {
    server.close(() => {

        console.warn("server shutting down")
        db.end()
        process.exit(0)

    });

    setTimeout(() => {

        console.error("couldn't close connections in time, force shutting down")
        process.exit(-1)
    }, 5 * 1000)
}
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)