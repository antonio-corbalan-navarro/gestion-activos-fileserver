import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Router } from 'express';
import { customOptions, options } from '../config/swagger';

const swaggerRouter = Router();

const specs = swaggerJsdoc(options);

swaggerRouter.use(
    "/documentation",
    swaggerUi.serve,
    swaggerUi.setup(specs, customOptions)
);

export default swaggerRouter;