import { Router } from 'express';
import { shareable, getResource, deleteResource } from '../controllers/resource.controller';
import { isAllowedResource, isAllowedToEdit } from '../middlewares/resources';

const routerV1 = Router()

routerV1
    .put('/:type/:table/:resourceId', isAllowedToEdit, shareable)
    .get('/:type/:table/:resourceId', isAllowedResource, getResource)
    .delete('/:type/:table/:resourceId', isAllowedToEdit, deleteResource)

export { routerV1 } 