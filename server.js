var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nconf = require('nconf');

//var database = require('./config/database.js');


nconf.argv().env().file({
    file: 'config.json'
});

var mysql      = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'webuser',
    password : 'webpass',
    database : 'hamburgerdb',
    multipleStatements: true
});

app.use(bodyParser.json());
app.post('/getquery',function(req,res){
    var body = req.body;
    var command = req.body.command;
    var arg = req.body.arg;
    var table = req.body.table;
    var condition = req.body.cond!=""? " WHERE " + req.body.cond : "";
    var order = req.body.order;
    var limit = req.body.limit;
    switch(command){
        case "SELECT":
            var query = command + " " + arg + " FROM " + table + condition + ";"; 
        break;
    }
   
    connection.query(query, function(err, rows, fields) {
        if (!err){
            res.send(rows);
        }else{
            console.log('Error while performing Query.');
            res.send('Error');
        }
    });
});

try {
    app.get('/users', function(req, res) {
        pool.getConnection(function(err, connection) {
            connection.query("SELECT userID, firstName, lastName, userName, email, permission FROM users;", function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/user");
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/user " + err);
                }
            });

            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/user endpoint!" + err);
}
try {
    app.get('/user/:userID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.params.userID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM users WHERE userID = ?;", [userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/user" + userID);
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/user/" + userID + " Error: " + err);
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/user/:userID endpoint!" + err);
}

try {
    app.post('/users/post', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var body = req.body;
        var firstName = body.firstName;
        var lastName = body.lastName;
        var userName = body.userName;
        var email = body.email;
        var password = body.password;
        var image = body.image;
        var query = "INSERT INTO Users (firstName,lastName,userName,password,email,image,permission) VALUES (?,?,?,?,?,?,1);";
        pool.getConnection(function(err, connection) {
            connection.query(query, [firstName,lastName,userName,password,email,image], function(err, rows, fields) {
                connection.release();
                if (!err) {
                    writelog("debug", "POST/register");
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                    writelog("error", "Error at endpoint POST/register. Username or e-mail is already taken." + err);
                    res.send(err.message);
                } else if (!userName || !email || !password) {
                    writelog("error", "Error at endpoint POST/register. Username, e-mail or password field is empty." + err);
                    res.send('Empty');
                } else {
                    writelog("error", "Error at endpoint POST/register " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing POST/register endpoint! " + err);
}

try {
    app.put('/users/update', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.body.userID;
        var userName = req.body.userName;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var permission = req.body.permission;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Users SET userName=?, firstName=?, lastName=?, email=?, permission=? WHERE userID = ?;", [userName, firstName, lastName, email, permission, userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/users/update " + userID);
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                        writelog("error", "Error at endpoint PUT/users/update " + err);
                        res.send(err.message);
                } else if (!userName || !email ||!firstName || !lastName) {
                    writelog("error", "Error at endpoint PUT/users/update. Username or e-mail field is empty." + err);
                    res.send('Empty');
                }else {
                writelog("error", "Error at endpoint PUT/users/update " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/users/update endpoint! " + err);
}

try {
    app.delete('/users/:userID', function(req, res) {
        var userID = req.params.userID;
        pool.getConnection(function(err, connection) {
            connection.query("DELETE FROM Users WHERE userID = ?;", [userID], function(err, rows, fields) {
                connection.release(); 
                if (!err) {
                    writelog("debug", "DELETE/users/" + userID);
                    res.send("OK");
                } else {
                    writelog("error", "Error at endpoint DELETE/users/" + userID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing DELETE/users/:userID endpoint! " + err);
}

try {
    app.get('/places', function(req, res) {
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM places;", function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/places");
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/places " + err);
                }
            });

            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/places endpoint!" + err);
}
try {
    app.get('/places/:placeID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.params.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM places WHERE placeID = ?;", [placeID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/places/" + placeID);
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/places/" + placeID + " Error: " + err);
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/places/:userID endpoint!" + err);
}

try {
    app.get('/placepage.html/:placeID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.params.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM places WHERE placeID = ?;", [placeID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/placeID/" + placeID);
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/placeID/" + placeID + " Error: " + err);
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/placeID/:placeID endpoint!" + err);
}


//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

try {
    app.get('/burgers', function(req, res) {
        pool.getConnection(function(err, connection) {
            connection.query("SELECT burgers.burgerID, burgers.burgerName, places.placeName, burgers.description FROM burgers, places WHERE burgers.placeID = places.placeID;", function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/burgers");
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/burgers " + err);
                }
            });

            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/burgers endpoint!" + err);
}
try {
    app.get('/burgers/:burgerID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT burgers.burgerID, burgers.burgerName, burgers.placeID, burgers.description, "+
                            "places.placeName, "+
                            "avg(ratings.pTaste) AS pTaste, avg(ratings.pPrepareTime) AS pPrepareTime, avg(ratings.pApperance) AS pApperance, avg(ratings.pTotal) AS pTotal, "+
                            "count(ratings.pTotal) AS count "+
                            "FROM burgers,places,ratings "+
                            "WHERE burgers.burgerID = ? AND burgers.placeID = places.placeID AND ratings.burgerID = burgers.burgerID;", [burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/burgerID/" + burgerID);
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/burgerID/" + burgerID + " Error: " + err);
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/burgerID/:burgersID endpoint!" + err);
}
try {
    app.get('/burgerpage.html/:burgerID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT * FROM burgers WHERE burgerID = ?;", [burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/burgerID/" + burgerID);
                    res.send(rows);
                } else {
                    writelog("error", "Error at endpoint GET/burgerID/" + burgersID + " Error: " + err);
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/burgerID/:burgersID endpoint!" + err);
}

try {
    app.get('/ratings/:burgerID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT Ratings.ratingID, users.userName, Ratings.pTaste, Ratings.pPrepareTime, Ratings.pApperance, Ratings.pTotal, Ratings.comment, Ratings.likes, Ratings.date "+
                            "FROM Ratings,users WHERE burgerID = ? AND Ratings.userID = users.userID", [burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/ratings/" + burgerID);
                    res.send(rows);
                } else {
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/ratings/:burgersID endpoint!" + err);
}

try {
    app.post('/rate',function(req,res){
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        var userID = req.body.userID;
        var burgerID = req.body.burgerID;
        var taste = req.body.taste;
        var prepare = req.body.prepare;
        var appear = req.body.appear;
        var total = req.body.total;
        var comment = req.body.comment;
        var query = "INSERT INTO Ratings (userID,burgerID,pTaste,pPrepareTime,pApperance,pTotal,comment) VALUES (?,?,?,?,?,?,?);";
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query,[userID,burgerID,taste,prepare,appear,total,comment], function(err, rows, fields) {
                connection.release();
                if (!err){
                    writelog("debug", "POST/rate/" + burgerID);
                    res.send("OK");
                }else{
                    writelog("error", "Error at endpoint POST/rate/" + burgerID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing POST/rate/ endpoint!" + err);
}
try {
    app.post('/like',function(req,res){
        res.setHeader("Access-Control-Allow-Origin", "*"); 
        var userID = req.body.userID;
        var ratingID = req.body.ratingID ;
        var burgerID = req.body.burgerID ;
        var isLike = req.body.isLike;
        var query = isLike ? "INSERT INTO Likes (userID,ratingID,burgerID) VALUES (?,?,?); UPDATE Ratings SET likes = likes + 1 WHERE ratingID = ?;" : 
                             "DELETE FROM Likes WHERE userID = ? AND ratingID = ? AND burgerID = ?; UPDATE Ratings SET likes = likes - 1 WHERE ratingID = ?;";
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query,[userID,ratingID,burgerID,ratingID], function(err, rows, fields) {
                connection.release();
                if (!err){
                    writelog("debug", "POST/like/" + ratingID);
                    res.send("OK");
                }else{
                    writelog("error", "Error at endpoint POST/like/" + ratingID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing POST/like/ endpoint!" + err);
}

try {
    app.get('/likes/:burgerID/:userID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.params.burgerID;
        var userID = req.params.userID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT ratingID FROM Likes WHERE burgerID = ? AND userID = ?;", [burgerID,userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/likes/" + burgerID + "/" + userID);
                    res.send(rows);
                } else {
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/likes/:burgerID/:userID endpoint!" + err);
}

 //connection.end();

users = [];
connections = [];

server.listen(process.env.PORT || 3333 );
console.log("Server is running...");

app.use('/css', express.static('frontend/css'));
app.use('/js', express.static('frontend/js'));
app.use('/font-awesome', express.static('frontend/font-awesome'));

app.get('/',function(req,res){
    res.sendFile(__dirname + '/frontend/index.html');
});

app.use(express.static('frontend'));
/*
io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log("Connected: %s sockets connected",connections.length);

    //Disconnect
    socket.on("disconnect",function(data){
        connections.splice(connections.indexOf(socket),1);
        console.log("Disconnected: %s sockets connected",connections.length);
    });

    //Send Message
    socket.on('send message',function(data){
        console.log(data);
       io.sockets.emit("new message", {msg:data});
    });


  
 connection.end();
  
})*/


function writelog(level, str) {
    switch (level.toLowerCase()) {
        case "all":
            var logLevel = 1;
            break;
        case "debug":
            var logLevel = 2;
            break;
        case "info":
            var logLevel = 3;
            break;
        case "warn":
            var logLevel = 4;
            break;
        case "error":
            var logLevel = 5;
            break;
        case "fatal":
            var logLevel = 6;
            break;
        case "off":
            var logLevel = 7;
            break;
    }
    switch (nconf.get('log:level').toLowerCase()) {
        case "all":
            var confLogLevel = 1;
            break;
        case "debug":
            var confLogLevel = 2;
            break;
        case "info":
            var confLogLevel = 3;
            break;
        case "warn":
            var confLogLevel = 4;
            break;
        case "error":
            var confLogLevel = 5;
            break;
        case "fatal":
            var confLogLevel = 6;
            break;
        case "off":
            var confLogLevel = 7;
            break;
    }
    if (confLogLevel <= logLevel) {
        console.log(str);
    }
}