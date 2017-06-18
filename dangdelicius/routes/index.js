const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
router.get('/', catchErrors(storeController.getStores));
router.get('/stores',catchErrors(storeController.getStores));

router.get('/add', storeController.addStore);
//Cuando hago un post de una tienda primero la subimos usando multer, luego la redimentsionamos con jim y creamos la tienda.
router.post('/add', 
    storeController.upload, 
    catchErrors(storeController.resize), 
    catchErrors(storeController.createStore)
);

router.post('/add/:id', 
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);

router.get('/store/:storeName', catchErrors(storeController.getSingleStore));


router.get('/stores/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
