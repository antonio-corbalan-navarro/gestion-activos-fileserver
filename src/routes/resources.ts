import { Router } from 'express';
import { shareable, getResource, deleteResource } from '../controllers/resource.controller';

const routerV1 = Router()

routerV1
    .put('/:type/:table/:resourceId', shareable)
    .get('/:type/:table/:resourceId', getResource)
    .delete('/:type/:table/:resourceId', deleteResource)

export { routerV1 } 