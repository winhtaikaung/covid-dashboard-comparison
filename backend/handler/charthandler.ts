
import express from 'express'
import * as core from 'express-serve-static-core';

import CountryDataDomain from '../domain/countrydata';
import HttpStatusCode from '../enums/httpstatus'
import BaseHandler from './base'
import { DomainLevelError } from '../domain/base'


enum ChartUseCasesType {
    USE_CASE_NEW_REPORTED_CASE = 'uc_new_reported',
    USE_CASE_POSITIVE_RATE = 'uc_positive_positive_rate',
    USE_CASE_DEATH_RATE = 'uc_death_rate',
    USE_CASE_ICU_VS_HOSP = 'uc_icu_vs_hosp',
    USE_CASE_VACCINATION_PERCENTAGE = 'uc_vaccination_percentage'
}


export default class DataHandler extends BaseHandler {
    private app: express.Application
    private countryDataDomain: CountryDataDomain

    constructor(route: express.Application, countryDataDomain: CountryDataDomain) {
        super()
        this.app = route
        this.countryDataDomain = countryDataDomain
        this.instantiateRoute()
    }

    public getRouter(): core.Router {
        return this.app
    }

    private instantiateRoute(): void {
        this.app.get('/countrydata/:useCase', this.validateCountryDatas.bind(this), this.getCountryDatas.bind(this))
    }

    private async validateCountryDatas(
        req: core.Request<
            { useCase: ChartUseCasesType },
            any,
            {
                data: any
            },
            {
                country: string
            }
        >,
        res: core.Response<any, Record<string, any>, number>,
        next: core.NextFunction,
    ) {
        const isValidCountryDataType = req.params && req.params.useCase && [ChartUseCasesType.USE_CASE_DEATH_RATE,
        ChartUseCasesType.USE_CASE_NEW_REPORTED_CASE,
        ChartUseCasesType.USE_CASE_POSITIVE_RATE].includes(req.params.useCase)
        const isCountryEmpty = req.query.country !== ''
        if (isValidCountryDataType || isCountryEmpty) {
            next()
        } else {
            res.status(HttpStatusCode.BAD_REQUEST).json(this.unprocessableEntity('Invalid Country'))
        }
    }

    private async getCountryDatas(
        req: core.Request<{ useCase: string }, any, any, {
            country?: string
        }>,
        res: core.Response<any, Record<string, any>, number>,
    ) {
        try {
            if (req.params.useCase === ChartUseCasesType.USE_CASE_NEW_REPORTED_CASE) {
                const rows = await this.countryDataDomain.getNewReportedCaseByCountry(req.query.country)
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }

            if (req.params.useCase === ChartUseCasesType.USE_CASE_POSITIVE_RATE) {
                const country = req.query.country
                const rows = await this.countryDataDomain.getTestPositivityRateByCountry(country)
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }
            if (req.params.useCase === ChartUseCasesType.USE_CASE_DEATH_RATE) {
                const country = req.query.country
                const rows = await this.countryDataDomain.getNewDeathsByCountry(country)
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }

            if (req.params.useCase === ChartUseCasesType.USE_CASE_ICU_VS_HOSP) {
                const country = req.query.country
                const rows = await this.countryDataDomain.getICUPatientVsHospByCountry(country)
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }

            if (req.params.useCase === ChartUseCasesType.USE_CASE_VACCINATION_PERCENTAGE) {
                const country = req.query.country
                const rows = await this.countryDataDomain.getTotalVaccicationPercentageByCountry(country)
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }

        }
        catch (e: unknown) {
            if (e instanceof DomainLevelError) {
                res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(this.internalServerError(e?.message))
                return
            }
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json(this.internalServerError((e as Error)?.message))
        }

    }


}