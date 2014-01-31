
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.indexx = function(req, res){
  //res.set('Content-Type','text/html');
  //res.render('index');
  res.sendfile('./public/index.html');
};