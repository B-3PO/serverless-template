const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([{
      type: 'input',
      name: 'serviceName',
      message: 'Your service name',
      default: this.appname // Default to current folder name
    }, {
      type: 'list',
      name: 'serviceType',
      message: 'Service type',
      choices: ['web service', 'scheduled task'],
      default: 'web service'
    }, {
      type: 'confirm',
      name: 'dynamodb',
      message: 'Would you like to use DynamoDB?'
    }, {
      type: 'confirm',
      name: 'logForwarding',
      message: 'Would you like to use log forwarding?',
      default: false
    }, {
      type: 'confirm',
      name: 'vpc',
      message: 'Would you like to put the Lambda functions in a VPC?',
      default: false
    }]);
    answers.authorizer = false;

    if (answers.serviceType === 'web service') {
      const auth = await this.prompt([{
        type: 'confirm',
        name: 'authorizer',
        message: 'Would you like to use a custom authorizer for the API Gateway routes?',
        default: false
      }]);
      answers.authorizer = auth.authorizer;
    }

    this.answers = answers;
  }

  async writing() {
    const pkgJson = {
      name: this.answers.serviceName,
      version: '1.0.0',
      description: '',
      main: 'index.js',
      author: '',
      license: 'ISC',
      scripts: {
        test: './node_modules/.bin/jest',
        start: 'source env/local.env && serverless offline start -s local',
        docs: 'source env/local.env && serverless openapi generate --format json'
      },
      dependencies: {
        eslint: '^5.1.0',
        'eslint-config-airbnb-base': '^13.0.0',
        'eslint-plugin-import': '^2.13.0',
        pino: '^5.10.3',
        'pino-pretty': '^2.5.0',
        'serverless-aws-static-file-handler': '^1.0.0',
        'serverless-plugin-warmup': '^4.2.0-rc.1',
        'serverless-pseudo-parameters': '^2.4.0',
        'swagger-ui-dist': '^3.20.3',
        uuid: '^3.3.2'
      },
      devDependencies: {
        jest: '^23.6.0',
        'serverless-offline': '^3.31.3',
        'serverless-openapi-documentation': '^0.4.0'
      }
    };

    if (this.answers.dynamodb) {
      pkgJson.scripts.setup = 'source env/local.env && serverless dynamodb install -s local && serverless dynamodb start --migrate && node app/utils/fixSwaggerPath.js';
      pkgJson.scripts.cleanup = 'kill -9 $(lsof -ti:8000) 2>/dev/null || true';
      pkgJson.scripts.test = 'npm run cleanup && source env/local.env && (sls dynamodb start -s local) & sleep 5 && ./node_modules/.bin/jest && npm run cleanup';

      pkgJson.dependencies.dynamoose = '^1.3.0';
      pkgJson.devDependencies['serverless-dynamodb-local'] = '0.2.30';
    }

    if (this.answers.logForwarding) {
      pkgJson.dependencies['serverless-log-forwarding'] = '^1.3.0';
    }
    this.fs.writeJSON('package.json', pkgJson);
    this.fs.copyTpl(
      this.templatePath('**/*'),
      this.destinationPath(),
      this.answers
    );
  }

  install() {
    this.spawnCommand('chmod', '+x', 'env/prod.env');
    this.spawnCommand('chmod', '+x', 'env/local.env');
    this.npmInstall();
  }
};
