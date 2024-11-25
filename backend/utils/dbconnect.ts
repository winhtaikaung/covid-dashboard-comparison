import pg from 'pg'

import { Log } from './log'

export class DBConnect {
    private connection: pg.Client | null
    private connectionStr: string

    constructor(conStr: string) {
        this.connectionStr = conStr
        this.connection = null
    }

    public async connect() {
        try {
            const connection = new pg.Client({
                connectionString: this.connectionStr
            })
            this.connection = connection
            await this.connection.connect()
            Log.success(`Database Connected to ${this.connectionStr}`)
        } catch (e: any) {
            Log.error(`Database connection error ${e?.stack}`)
            process.exit()
        }
    }

    public async disConnect() {
        try {
            if (this.connection) {
                await this.connection.end()
            }
            Log.success(`Database Disconnected Successfully from ${this.connectionStr}`)
        } catch (e: any) {
            Log.error(`Database connection error ${e?.stack}`)
        }
    }

    public async getClient(): Promise<pg.Client | null> {
        if (this.connection === null) {
            await this.connect()
        }

        return this.connection

    }
}