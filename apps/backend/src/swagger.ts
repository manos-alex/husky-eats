import fs from "node:fs";
import path from "node:path";
import swaggerJSDoc from "swagger-jsdoc";
import yaml from "yaml";

const docsPath = path.resolve("src/docs/api-docs.yaml");
const swaggerDefinition = yaml.parse(fs.readFileSync(docsPath, "utf-8"));

export const swaggerSpec = swaggerJSDoc({
    swaggerDefinition,
    apis: ["/src/routes/**/*.ts", docsPath],
});
