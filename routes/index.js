
/*
 * GET home page.
 */

var crypto = require('crypto'),
User = require('../models/user.js');
Post = require('../models/post.js');
Category = require('../models/category.js')

var md = require('marked');

module.exports = function(app){
  app.get('/',function(req,res){
    Post.get(null, function(err, posts){
      if(err){
        posts = [];
      }
      res.render('index', { 
        title: "Tairy's Blog-Home",
        user: req.session.user,
        posts: posts,
        success: req.flash('success').toString(),
        error: req.flash('error').toString(),
        md: md
      });
    });
  });

  app.get('/contents',function(req,res){
    Category.get(null, function(err, categorys){
      if(err){
        categorys= [];
      }
      res.render('contents', { 
        title: "Tairy's Blog-Contents",
        categorys: categorys
      });
    });
  });

  app.get('/category',function(req,res){
    res.render('category', { 
      title: "Tairy's Blog-Category",
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.get('/editcategory/:aliase',function(req,res){
    var aliase = req.params.aliase;
    Category.get(aliase,function(err,categorys){
      if(err){
        category = [];
      }

      res.render('editcategory', { 
      title: "Tairy's Blog-EditCategory",
      user: req.session.user,
      categorys: categorys,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
      });
    });
  });

  app.post('/editcategory/:aliase',function(req,res){
    var category = new Category(req.body.name, req.body.aliase, req.body.color);
    var aliase = req.params.aliase;
    category.update(aliase,function(err){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '更新成功!');
      res.redirect('/contents');
    });
  });

  app.get('/detail/:id',function(req,res){
    var id = req.params.id;
    Post.get(id, function(err, posts){
      if(err){
        posts = [];
      }
      res.render('detail', { 
        title: "Tairy's Blog-Detail",
        user: req.session.user,
        posts: posts,
        md: md
      });
    });
  });

  app.get('/edit/:id',function(req,res){
    var id = req.params.id;
    Post.get(id, function(err, posts){
      if(err){
        posts = [];
      }
      res.render('edit', { 
        title: "Tairy's Blog-Detail",
        user: req.session.user,
        posts: posts
      });
    });
  });

  app.get('/login',function(req,res){
    res.render('login', { 
      title: "Tairy's Blog-Login",
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  // app.get('/signup',function(req,res){
  //   res.render('signup', { 
  //     title: "Tairy's Blog-Signup",
  //     user: req.session.user,
  //     success: req.flash('success').toString(),
  //     error: req.flash('error').toString()
  //   });
  // });

  app.get('/about',function(req,res){
    res.render('about', { title: "Tairy's Blog-About" });
  });

  app.get('/comment',function(req,res){
    res.render('comment', { title: "Tairy's Blog-Comment" });
  });

  app.get('/post',function(req,res){
    res.render('post', { 
      title: "Tairy's Blog-Post",
      user: req.session.user,
      success: req.flash('success').toString(),
      error: req.flash('error').toString()
    });
  });

  app.post('/login',function(req,res){
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');

    User.get(req.body.email, function(err, user){
      if(!user){
        req.flash('error', '用户不存在!');
        return res.redirect('/login');
      }

      if(user.password != password){
        req.flash('error', '密码错误!');
        return res.redirect('/login');
      }

      req.session.user = user;
      req.flash('success', '登陆成功!');
      res.redirect('/');
    });
  });

  app.post('/logout',function(req,res){
    req.session.user = null;
    req.flash('success', '登出成功!');
    res.redirect('/');
  });

  app.post('/post',function(req,res){
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.category,req.body.categoryaliase ,req.body.post);

    post.save(function(err){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '发布成功!');
      res.redirect('/');
    });
  });

  app.post('/edit/:id',function(req,res){
    var currentUser = req.session.user;
    var timestamp = req.params.id;
    var post = new Post(currentUser.name, req.body.title, req.body.category, req.body.post);

    post.update(timestamp,function(err){
      if(err){
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', '更新成功!');
      res.redirect('/detail/'+timestamp);
    });
  });

  app.post('/category',function(req,res){
    var name = req.body.name,
        aliase = req.body.aliase,
        color = req.body.color;

    if(name == "" || color == ""){
      req.flash('error','名称和背景色不能为空!');
      return res.redirect('/category');
    }

    var newCategory = new Category(name, aliase, color);

    newCategory.save(function(err){
      if(err){
        req.flash('error',err);
        res.redirect('/catrgory');
      }

      req.flash('success', '添加成功!');
      res.redirect('/contents');
    });
  });

  // app.post('/signup',function(req,res){
  //   var name = req.body.username,
  //       password = req.body.password,
  //       conpassword = req.body['conpassword'];
  //   if(conpassword != password){
  //     req.flash('error', '两次输入的密码不一致!');
  //     return res.redirect('/signup');
  //   }

  //   var md5 = crypto.createHash('md5'),
  //       password = md5.update(req.body.password).digest('hex');

  //   var newUser = new User({
  //     name : req.body.username,
  //     password : password,
  //     email : req.body.email
  //   });

  //   User.get(newUser.email, function(err, user){
  //     if(user){
  //       err = '用户已存在!';
  //     }

  //     if(err){
  //       req.flash('error', err);
  //       return res.redirect('/signup');
  //     }

  //     newUser.save(function(err){
  //       if(err){
  //         req.flash('error', err);
  //         return res.redirect('/signup');
  //       }

  //       req.session.user = newUser;
  //       req.flash('success', '注册成功!');
  //       res.redirect('/');
  //     });
  //   });
  // });
};