import express from 'express'
import pg from 'pg'
import bodyParser from 'body-parser'
import { createServer, Server } from 'http'
import 'dotenv/config'
import cors from 'cors'

import { DBConnect } from './utils/dbconnect'
import Options from './domain/option'
import OptionHandler from './handler/optionshandler'
import CountryData from './domain/countrydata'
import DataHandler from './handler/charthandler'

class DashboardAPIService {
    public static readonly PORT: number = 5000

    private port: string | number
    private expressApp: express.Application
    private server: Server

    private dbClient: pg.Client | null

    constructor(dbConn: pg.Client | null) {
        this.expressApp = express()
        this.port = process.env.SERVER_PORT || DashboardAPIService.PORT
        this.expressApp.use(cors())
        this.expressApp.use(express.json())
        this.expressApp.options('*', cors())
        this.dbClient = dbConn

        this.setupRoutes()

        this.server = createServer(this.expressApp)
        this.listen()
    }

    get app(): express.Application {
        return this.expressApp
    }

    private setupRoutes(): void {
        const optionsDomain = new Options(this.dbClient, 'covid_data')
        const countryDataDomain = new CountryData(this.dbClient, 'covid_data')

        new OptionHandler(this.expressApp, optionsDomain)
        new DataHandler(this.expressApp, countryDataDomain)
    }

    private listen(): void {
        this.expressApp.use(bodyParser.urlencoded({ extended: false }))
        this.expressApp.use(bodyParser.json())
        this.server.listen(this.port, () => {
            process.stdout.write(`Running server on port ${this.port}\n`)
        })
    }
}

async function DashboardApp() {
    const pgConnect = new DBConnect(
        `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}/${process.env.POSTGRES_DB}?connect_timeout=10`
    )

    await pgConnect.connect()
    const dbClient = await pgConnect.getClient()

    const app = new DashboardAPIService(dbClient).app
    return app
}

require('dotenv').config()

const app = DashboardApp()

export default app