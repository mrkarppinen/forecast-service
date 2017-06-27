

const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;

const ForecastDB = require('../src/forecast-db.js');
const fs = require('fs');
const Cloudant = require('cloudant');
const co = require('co');


describe('ForecastDB', () => {

  let testDB = null;
  let forecastDB = null;
  let inserted = null;



  before(() => {

     const dbConf = JSON.parse(fs.readFileSync('parameters.js', 'utf8'));
     const cloudant = Cloudant({account:dbConf.dbUsername, password:dbConf.dbPassword, plugin: 'promises'});


     if (cloudant == null)
      throw new Error("Cloudant connection failed.");


      testDB = cloudant.db.use('test');

     forecastDB = new ForecastDB(testDB);
  });


  describe('insert', () => {

    it('Should add new object', () => {

      return forecastDB.insert('60.192059','24.945831', {x: '1000'}).then( (doc) => {
        expect(doc).not.to.be.null;
        expect(doc.id).equal('60.192059_24.945831');
        expect(doc.updated).not.to.be.null;
        inserted = doc.rev;
      });

    });

  });


  describe('get()', () => {

    it('Should return empty', () => {
        return forecastDB.get('40.730610','_-73.935242').then( (doc) => {
          expect(doc).to.be.null;
        });
    });


    it('Should return object', () => {
        return forecastDB.get('60.192059','24.945831').then( (doc) => {
          expect(doc).not.to.be.null;
          expect(doc._id).equal('60.192059_24.945831');
        });
    });


  });


  describe('update', () => {

    it('Should object data', () => {
        return forecastDB.update('60.192059_24.945831', inserted, {x: '200'}).then( (doc) => {
          expect(doc.ok).equal(true);
          expect(doc.updated).not.to.be.undefined;
          expect(doc.data.x).equal('200')
        });
    });

  });


  after((done) => {

    co(function *(){
      let list = yield listAll(testDB);
      let deleted = list.rows.map( (item) => {
        return {
          _id: item.id,
          _rev: item.value.rev,
          _deleted: true
        };
      });
     yield testDB.bulk({ docs: deleted });
    }).then(
      done,
      (error) => {
        console.log(error);
        done();
      }
    );

  });

  function listAll(db){
      return new Promise( (resolve, reject) => {

        db.list().then( (result)=> {
            resolve(result);
        }).catch( (err) => {
          console.error(err);
          resolve('');
        });
      });
  }


});
