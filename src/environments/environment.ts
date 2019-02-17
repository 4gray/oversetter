const packageJson = require('../../package.json');

export const environment = {
    production: false,
    VERSION: packageJson.version,
    DESCRIPTION: packageJson.description,
    REPOSITORY: packageJson.repository.url
};
