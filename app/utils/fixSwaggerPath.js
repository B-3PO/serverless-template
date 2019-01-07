const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../node_modules/swagger-ui-dist/index.html');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) return console.log(err);
  const result = data.replace(/https:\/\/petstore.swagger.io\/v2\/swagger.json/g, '/openapi.json');
  fs.writeFile(filePath, result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
