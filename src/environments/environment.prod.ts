const packageJson = require('../../package.json');

export const environment = {
    production: true,
    VERSION: packageJson.version,
    DESCRIPTION: packageJson.description,
    REPOSITORY: packageJson.repository.url
};
