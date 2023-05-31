import express from "express";
import * as developersController from '../controllers/developersController.js';

const router = express.Router();

router.get('/developers', developersController.showAllDevelopers);
router.get('/developers/:idDeveloper', developersController.showDeveloperById);
router.get('/developers/search/:query', developersController.searchDevelopersByName);
router.post('/developers', developersController.newDeveloper);    
router.put('/developers', developersController.updateDeveloper);
router.delete('/developers/:idDeveloper', developersController.deleteDeveloper);

export default router;