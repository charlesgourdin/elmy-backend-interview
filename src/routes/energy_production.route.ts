import * as express from "express";
import { EnergyProductionController } from '../controllers/energy_production.controller'

const router = express.Router();

const EnergyProductionCtrl = new EnergyProductionController()

router.post('/', EnergyProductionCtrl.getGlobalProduction)

export default router