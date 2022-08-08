import { Request, Response, NextFunction } from 'express';

import EnergyProductionService from '../services/energy_production.service'

export class EnergyProductionController {
    async getGlobalProduction(req: Request, res: Response, next: NextFunction): Promise<any> {
        const { from , to, format } = req.query

        if (!(from && to && format)) {
            res.status(400).send('[ERROR] Missing query params')
            return next()
        }

        try {
            const result = await EnergyProductionService.getTotalProduction(req.query)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send('[ERROR] Something broke!')
        } finally {
            return next()
        }
    }
}