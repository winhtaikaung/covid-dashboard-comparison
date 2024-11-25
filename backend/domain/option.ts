import pg from "pg"
import BaseDomain from "./base"

export default class Options extends BaseDomain {
    constructor(db: pg.Client | null, tblName: string) {
        super(db, tblName)
    }


    public async getContinents() {
        const query = `SELECT DISTINCT LOWER(continent) as name,continent as displayName FROM ${this.tableName} WHERE continent IS NOT NULL ORDER BY name,displayName ASC;`
        const result = await this.queryData(query)
        return result
    }


    public async getCountriesByContinent(continentName?: string) {
        const query = `SELECT DISTINCT LOWER(country) as name,country as displayName FROM covid_data WHERE LOWER(continent) = '${continentName}' and continent IS NOT NULL ORDER BY name,displayName ;`
        const result = await this.queryData(query)
        return result

    }




}