var mongodb = require('./db');
var crypto = require('crypto');

function Post(name, title,category,categoryaliase, post) {
  this.username = name;
  this.title= title;
  this.categoryaliase = categoryaliase;
  this.category = category;
  this.post = post;
}

module.exports = Post;

Post.prototype.save = function(callback) {//存储一篇文章及其相关信息
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth()+1),
      day : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes()
  }

  var timestamp = Date.parse(date).toString();

  var md5 = crypto.createHash('md5');
  timestamp = md5.update(timestamp).digest('hex');

  var category = {
    name:this.category,
    aliase: this.categoryaliase
  }
  //要存入数据库的文档
  var post = {
      username: this.username,
      time: time,
      title:this.title,
      category: category,
      post: this.post,
      timestamp: timestamp
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      //将文档插入 posts 集合
      collection.insert(post, {
        safe: true
      }, function (err,post) {
        mongodb.close();
        callback(null);
      });
    });
  });
};

Post.prototype.update = function(timestamp, callback){
  var category = {
    name:this.category,
    aliase: this.categoryaliase
  }
  var post = {
      username: this.username,
      title:this.title,
      category:category,
      post: this.post
  };
  mongodb.open(function (err,db){
    if(err){
      return callback(err);
    }

    db.collection('posts', function (err, collection){
      if (err) {
        mongodb.close();
        return callback(err);
      }

      collection.update({'timestamp':timestamp},{$set:post},function(err,result) {
        mongodb.close();
        callback(null);
      });
    });

  });

};

Post.get = function(timestamp, callback) {//读取文章及其相关信息
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err,null);
    }
    //读取 posts 集合
    db.collection('posts', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err,null);
      }
      var query = {};
      if (timestamp) {
        query.timestamp = timestamp;
      }
      //根据 query 对象查询文章
      collection.find(query).sort({
        time: -1
      }).toArray(function (err, docs) {
        mongodb.close();
        if (err) {
          callback(err, null);//失败！返回 null
        }
        callback(null, docs);//成功！以数组形式返回查询的结果
      });
    });
  });
};

Post.getCategory = function(callback){
  mongodb.open(function (err, db){
    if(err){
      return callback(err,null);
    }
    var liclass = [6,3,3,3,3,3,6,3,3,3,3,6];
    var divclass = [1,2,3,3,3,3,1,2,2,3,3,1];

    var collection = db.collection('posts');
    collection.group(
      {
       "category.name":1,
       "category.aliase":1, 
      },
      {},
      {count:0},
      function(item, summaries){
        summaries.count++;
      },
      true,
      function(err, results){
        results.sort(function(a,b){return Math.random()>0.5?1:0});
        var color = db.collection('color');
        var array_length = results.length;
        color.find().limit(array_length).toArray(function (err, doc){
          mongodb.close();
          doc.sort(function(a,b){return Math.random()>0.5?1:0});
          
          for(key in results){
            results[key]['liclass'] = liclass[key%12];
            results[key]['divclass'] = divclass[key%12];
            results[key]['name'] = results[key]['category.name'];
            results[key]['aliase'] = results[key]['category.aliase'];

            if(key%12 == 2 || key%12 == 4 || key%12 == 9){
              results[key]['nextdiv'] = results[Number(key)+1];
            }else{
              results[key]['nextdiv'] = null;
            }

            if(key%12 == 3 || key%12 == 5 || key%12 == 10){
              results[key]['display'] = false;
            }else{
              results[key]['display'] = true;
            }
            results[key]['color'] = doc[key]['name'];
          }
          if (err) {
            callback(err, null);
          }
          callback(null, results);
        });
      });
  });
}

Post.getCategoriedArticle = function(aliase, callback){
  mongodb.open(function (err, db){
    if(err){
      return callback(err,null);
    }
    db.collection('posts', function(err, collection) {
      if(err){
        mongodb.close();
        return callback(err,null);
      }
      if(aliase){
        var query = {};
        query['category.aliase'] = aliase;
      }
      collection.find(query).toArray(function (err, docs){
        docs.sort(function(a,b){return Math.random()>0.5?1:0});  
        mongodb.close();
        if(err){
          callback(err,null);
        }
        callback(null,docs);
      });
    });
  });
}