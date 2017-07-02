
class ForecastDB {

  constructor(db){
    this.db = db;
  }


  get(location){

      return new Promise( (resolve, reject) => {
          this.db.get(location)
          .then( (body) => { resolve(body); } )
          .catch( (error) => {

            if (error.statusCode == 404) {
              resolve(null);
            }else {
              reject(error);
            }

           } );
      });

  }


  insert(location, data){
      return new Promise( (resolve, reject) => {
        const updated = new Date().getTime();
        this.db.insert({updated:updated, data: data}, location).then(
          (doc) => { 
            doc.updated = updated;
            doc.data = data;
            resolve(doc);
          },
          reject
        );


      });
  }

  update(id, rev, data){
      return new Promise( (resolve, reject) => {
        const updated = new Date().getTime();
        this.db.insert({_id: id, _rev:rev, updated:updated, data: data}).then(
          (doc) => {
            doc.updated = updated;
            doc.data = data;
            resolve(doc);
          },
          reject
        );
      });
  }

  clear(){
    return new Promise( (resolve, reject) => {

      resolve(false);

    });
  }


}



module.exports = ForecastDB;
