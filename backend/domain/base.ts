import pg from 'pg'
import { Log } from '../utils/log';

export class DomainLevelError extends Error {
    constructor(public message: string) {
        super(message);
        this.name = "Domain Logic Error";
        this.stack = (<any>new Error()).stack;
    }
}

export default class BaseDomain {
    public dbClient: pg.Client | null
    public tableName: string
    constructor(db: pg.Client | null, tblName: string) {
        this.dbClient = db
        this.tableName = tblName
    }

    protected getConnection(): pg.Client | null {
        return this.dbClient
    }

    public escapeSQLStr(str: string): string {
        const sanitizedInput = str
            .replace(/[\0\n\r\b\t\\'"\x1a]/g, '') // Remove characters with special meaning in SQL
            .replace(/--/g, '') // Remove SQL comments
            .replace(/\/\*/g, '')
            .replace(/\*\//g, '');

        return sanitizedInput;
    }

    public async queryData(queryString: string): Promise<{ [key: string]: any }[]> {
        const sql = queryString
        Log.info(sql)
        try {
            const result = await this.dbClient?.query(sql)
            const parsedResult = result?.rows.map(row => {
                const parsedRow: { [key: string]: any } = {};
                for (let key in row) {
                    parsedRow[key] = row[key];
                }
                return parsedRow;
            })
            return parsedResult || []
        } catch (e: any) {
            const errMsg = `An Error Found while querying data .
                 \n${sql}
                 \n${e?.stack}`

            Log.error(errMsg)
            throw new DomainLevelError(errMsg)

        }
    }
}