
class ForecastDB {

  constructor(db){
    this.db = db;
  }


  get(location){

     return  this.db.get(location)
        .then( (body) => body )
        .catch( (error) => {
          if (error.statusCode == 404) {
            return null;
          }else {
            return error;
          }

        } );

  }


  insert(location, data){

        const updated = new Date().getTime();
        return this.db.insert({updated:updated, data: data}, location).then(
          (doc) => { 
            doc.updated = updated;
            doc.data = data;
            return doc;
          }
        );


  }

  update(id, rev, data){
        const updated = new Date().getTime();
        return this.db.insert({_id: id, _rev:rev, updated:updated, data: data}).then(
          (doc) => {
            doc.updated = updated;
            doc.data = data;
            return doc;
          }
        );
  }

  clear(){
    return new Promise( (resolve, reject) => {

      resolve(false);

    });
  }


}



module.exports = ForecastDB;
