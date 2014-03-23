var mongodb = require('./db');

function Category(name, aliase, color){
	this.name = name;
	this.aliase = aliase;
	this.color = color;
}

module.exports = Category;

Category.prototype.save = function(callback){
	var category = {
		name: this.name,
		aliase: this.aliase,
		color: this.color
	}

	mongodb.open(function (err,db){
		if(err){
			mongodb.close();
			return callback(err);
		}
		db.collection('categorys',function (err, collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.insert(category,{
				safe:true
			}, function (err, category) {
				mongodb.close();
				callback(null);
			});
		});
	});
}

Category.prototype.update = function(aliase,callback){
	var category = {
		name: this.name,
		aliase: this.aliase,
		color: this.color
	};

	mongodb.open(function (err,db){
		if(err){
			return callback(err);
		}

		db.collection('categorys',function (err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}

			collection.update({'aliase':aliase},{$set:category},function(err, result){
				mongodb.close();
				callback(null);
			});
		});
	});
}

Category.get = function(aliase, callback){
	mongodb.open(function (err, db){
		if(err){
			return callback(err,null);
		}

		var liclass = [6,3,3,3,3,3,6,3,3,3,3,6];
		var divclass = [1,2,3,3,3,3,1,2,2,3,3,1];
		db.collection('categorys', function(err, collection) {
			if(err){
				mongodb.close();
				return callback(err,null);
			}

			var query = {};
			if(aliase){
				query.aliase = aliase;
			}

			collection.find(query).toArray(function (err, docs){
				docs.sort(function(a,b){return Math.random()>0.5?1:0}); //简单打乱方法  
				for(key in docs){
					docs[key]['liclass'] = liclass[key%12];
					docs[key]['divclass'] = divclass[key%12];
					if(key%12 == 2 || key%12 == 4 || key%12 == 9){
						docs[key]['nextdiv'] = docs[Number(key)+1];
					}else{
						docs[key]['nextdiv'] = null;
					}

					if(key%12 == 3 || key%12 == 5 || key%12 == 10){
						docs[key]['display'] = false;
					}else{
						docs[key]['display'] = true;
					}
				}
				mongodb.close();
				if(err){
					callback(err,null);
				}
				callback(null,docs);
			});
		});
	});
}