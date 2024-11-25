import express from 'express'
import * as core from 'express-serve-static-core'

import OptionDomain from '../domain/option'
import HttpStatusCode from '../enums/httpstatus'
import BaseHandler from './base'
import { DomainLevelError } from '../domain/base'
import { Log } from '../utils/log'

enum OptionType {
    CONTINENT = 'continent',
    COUNTRY = 'country'
}

export default class OptionHandler extends BaseHandler {
    private app: express.Application
    private optionsDomain: OptionDomain

    constructor(route: express.Application, optionsDomain: OptionDomain) {
        super()
        this.app = route
        this.optionsDomain = optionsDomain
        this.instantiateRoute()
    }

    public getRouter(): core.Router {
        return this.app
    }


    private instantiateRoute(): void {
        this.app.get('/options/:optType', this.validateOptions.bind(this), this.getOptions.bind(this))
    }

    private async validateOptions(
        req: core.Request<
            { optType: string },
            any,
            {
                data: any
            },
            {
                continent: string
            }
        >,
        res: core.Response<any, Record<string, any>, number>,
        next: core.NextFunction,
    ) {
        const isValidOptionType = req.params && req.params.optType && ["continent", "country"].includes(req.params.optType)
        const isValidValidContinent = req.params.optType === "country" && req.query.continent && ["asia", "africa", "europe", "north america", "oceania", "south america"].includes(req.query.continent.toLowerCase())
        if (isValidOptionType || isValidValidContinent) {
            next()
        } else {
            res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json(this.unprocessableEntity('Invalid Options'))
        }
    }




    private async getOptions(
        req: core.Request<{ optType: string }, any, any, {
            continent?: string
        }>,
        res: core.Response<any, Record<string, any>, number>,
    ) {
        try {
            if (req.params.optType === OptionType.CONTINENT) {
                const rows = await this.optionsDomain.getContinents()
                if (rows) {
                    res.status(HttpStatusCode.OK).json(this.resBody(rows))
                    return
                }
            }

            if (req.params.optType === OptionType.COUNTRY) {
                const continent = req.query.continent
                const rows = await this.optionsDomain.getCountriesByContinent(continent)
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