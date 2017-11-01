var express = require('express');
var router = express.Router();

// haha start
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'test1234',
  database : 'iot'
});
connection.connect();
// haha end

/* GET users listing. */
// 전체 사용자 목록 조회 GET - /users
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');
  connection.query('select id, email, name, age from user',
  	function(err, results, fields){
  		if(err){
  			res.send(JSON.stringify(err));
  		}else{
  			res.send(JSON.stringify(results));
  		}
  	});
});
// 특정사용자 정보 조회 :   GET    - /users/id
router.get('/:id', function(req, res, next){
	connection.query('select id, email, name, age from user where id=?',
		[req.params.id],function(err, results, fields){
			// console.log(JSON.stringify(fields));
			if (err){
				res.send(JSON.stringify(err));
			} else {
				if( results.length > 0){
					res.send(JSON.stringify(results[0]));
				} else {
					res.send(JSON.stringify({}));
				}
				
			}	
		});
});

// 사용자 정보 추가(가입) : POST   - /users
var crypto = require('crypto');
router.post('/', function(req, res,next){
	var email = req.body.email;
	var password = req.body.password;
	var name = req.body.name;
	var age = req.body.age;
	console.log(email+ ', ' +password+', '+name+', '+age);
	var hash = crypto.createHash("sha512").update(password).digest('base64');
	console.log(hash);
	connection.query(
		'insert into user(email,password,name,age) values(?,?,?,?)',
		[email, hash, name, age ],
		function(err, result){
			if (err){
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(result));
			}	
		});
	// res.send(JSON.stringify({email:email, password:hash, name:name, age:age}));
});

// 사용자 정보 수정 :       PUT    - /users/id
router.put('/:id', function(req,res,next){
		var email = req.body.email;
	var password = req.body.password;
	var name = req.body.name;
	var age = req.body.age;
	console.log(email+ ', ' +password+', '+name+', '+age);

	var query = 'update user set ';
	var conditions = [];
	if( email != undefined){
		query += "email=?,";	conditions.push(email);
	}
	if( password != undefined){
		var hash = crypto.createHash("sha512").update(password).digest('base64');
		query += "password=?,"; conditions.push(hash);
	}
	if(name != undefined){
		query += "name=?,"; 	conditions.push(name);
	}
	if(age != undefined){
		query += "age=?"; 		conditions.push(age); 
	}
	if( query[query.length-1] == ',') // 쉼표제거
		query = query.substring(0, query.length-1);
	query += " where id=?";
	console.log(query);
	console.log(conditions);

	conditions.push(req.params.id);
	connection.query(query, conditions,
	// connection.query(
	// 	'update user set email=?,password=?,name=?,age=? where id=?',
	// 	[email, hash, name, age, req.params.id ],
		function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		})
	// res.send(JSON.stringify({id:req.params.id}));

});
// 사용자 정보 삭제 :       DELETE - /users/id
router.delete('/:id', function(req,res,next){
	connection.query('delete from user where id=?',
		[req.params.id], function(err, result){
			if(err){
				res.send(JSON.stringify(err));
			}else{
				res.send(JSON.stringify(result));
			}
		});
	// res.send(JSON.stringify({id:req.params.id}));
});
module.exports = router;
