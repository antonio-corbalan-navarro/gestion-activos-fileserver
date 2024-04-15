import { Router } from 'express';
import { shareable, getResource, deleteResource } from '../controllers/resource.controller';
import { isAllowedResource } from '../middlewares/resources';

const routerV1 = Router()

routerV1
    .put('/:type/:table/:resourceId', isAllowedResource, shareable)
    .get('/:type/:table/:resourceId', isAllowedResource, getResource)
    .delete('/:type/:table/:resourceId', isAllowedResource, deleteResource)

export { routerV1 } 