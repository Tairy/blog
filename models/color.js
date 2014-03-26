var mongodb = require('./db');

function Color(name){
	this.name = name;
}

module.exports = Color;

Color.prototype.save = function (callback){
	var data = {
		name: this.name
	}

	mongodb.open(function (err, db){
		if(err){
			return callback(err);
		}

		db.collection('color', function (err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.insert(data,{
				safe:true
			},function (err, post){
				mongodb.close();
				return callback(null);
			});
		});
	});
}