"use strict";
import express, { application } from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { fileURLToPath } from "url"
import { join, dirname } from "path"


const app = express()
const port = 3900
const server = app.listen(port, () => { console.debug("Listening to port: ", port) })
const __dirname = join(dirname(fileURLToPath(import.meta.url)), "public")
const appinfo = {
    year: new Date().getFullYear()
}


//---------------Middlewear------------------------

app.use(express.static(__dirname))
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ type: ['application/json', 'text/*'] }))
app.use(cors())
app.use(cookieParser())
app.set('view engine', 'ejs')

//---------------------------------------------------

app.get("/", (req, res) => {

    res.status(200).render("index", { appinfo: appinfo, game: { data: {} } })


})


const cleanup = () => {
    server.close(() => {

        console.warn("CLOSING THE SERVER")
        process.exit(0)

    });
}
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)