import path from 'path'
import { API } from './server';

const { SwaggerTheme } = require('swagger-themes');
const theme = new SwaggerTheme();

export const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "DilusWebApp",
            version: "0.1.0",
            description:
                "Entry points documentation",
            license: {
                name: "MIT",
                url: "https://spdx.org/licenses/MIT.html",
            },
            contact: {
                name: "dilus",
                url: "https://app.dilustech.com/",
                email: "dilus@gmail.com",
            },
        },
        servers: [
            {
                url: `http://${API.host}:${API.port}`,
            },
        ],
    },
    apis: [`${path.join(__dirname, '../routes/documentation/*.ts')}`]
};

export const customOptions = {
    explorer: true,
    customCss: theme.getBuffer('classic')
}
