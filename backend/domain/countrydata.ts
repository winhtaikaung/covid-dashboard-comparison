import pg from "pg"
import BaseDomain from "./base"

export default class CountryDataDomain extends BaseDomain {
    constructor(db: pg.Client | null, tblName: string) {
        super(db, tblName)
    }


    public async getNewReportedCaseByCountry(countryName?: string) {
        const sanitizeCountryName = this.escapeSQLStr(countryName?.trim() || '')
        const query = `SELECT date, new_cases FROM ${this.tableName} WHERE new_cases > 0 AND LOWER(country) = '${sanitizeCountryName}' ORDER BY date;`
        const result = await this.queryData(query)
        return result
    }


    public async getTestPositivityRateByCountry(countryName?: string) {
        const sanitizeCountryName = this.escapeSQLStr(countryName?.trim() || '')
        const query = `SELECT date, positive_rate FROM ${this.tableName} WHERE positive_rate AND LOWER(country) = '${sanitizeCountryName}' IS NOT NULL ORDER BY date;`
        const result = await this.queryData(query)
        return result
    }

    public async getNewDeathsByCountry(countryName?: string) {
        const sanitizeCountryName = this.escapeSQLStr(countryName?.trim() || '')
        const query = `SELECT date, new_deaths FROM ${this.tableName} WHERE new_deaths > 0 AND Lower(country) = '${sanitizeCountryName}' ORDER BY date;`
        const result = await this.queryData(query)
        return result
    }

    public async getICUPatientVsHospByCountry(countryName?: string) {
        const sanitizeCountryName = this.escapeSQLStr(countryName?.trim() || '')
        const query = `SELECT sq.country,sq.date,sq.total_hosp_patients,sq.total_icu_patients FROM (SELECT country, DATE_TRUNC('week', date) AS date, SUM(hosp_patients) AS total_hosp_patients,SUM(icu_patients) AS total_icu_patients FROM ${this.tableName} WHERE hosp_patients IS NOT NULL OR icu_patients IS NOT NULL GROUP BY DATE_TRUNC('week', date) ,country ORDER BY date ASC) as sq where LOWER(country) = '${sanitizeCountryName}'`
        const result = await this.queryData(query)
        return result
    }

    public async getTotalVaccicationPercentageByCountry(countryName?: string) {
        const sanitizeCountryName = this.escapeSQLStr(countryName?.trim() || '')
        const query = `SELECT country, (MAX(people_fully_vaccinated) * 100.0 / MAX(population)) AS percent_fully_vaccinated, (MAX(total_boosters) * 100.0 / MAX(population)) AS percent_booster_added, (MAX(population) * 100.0 / MAX(population)) AS population FROM ${this.tableName} WHERE LOWER(country) = '${sanitizeCountryName}' AND (people_fully_vaccinated IS NOT NULL OR total_boosters IS NOT NULL) GROUP BY country,population;`
        const result = await this.queryData(query)
        return result
    }




}