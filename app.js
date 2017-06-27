const fs = require('fs');
const action = require('./index');

const params = JSON.parse(fs.readFileSync('parameters.json','utf-8'));

action.main(params).then(
    (res) => { console.log(res); },
    (err) => { console.error(err); }
);