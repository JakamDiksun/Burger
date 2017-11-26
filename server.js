const express = require('express');
const passport = require('passport');
const expressSession = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var nconf = require('nconf');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

//var database = require('./config/database.js');


nconf.argv().env().file({
    file: 'config.json'
});

var mysql      = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'hamburgerdb',
    multipleStatements: true
});


var User = {
    userID: -1,
    userName: "",
    findById: function(id, callback) {
        callback(null, this);

    }
}

app.use(expressSession({
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2628000000
    }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({
    limit: '100mb'
}));
app.use(bodyParser.urlencoded({
    limit: '100mb',
    extended: true
}));
app.use(bodyParser.json());
app.use(flash());
app.use('/', require('./router.js')(passport));

passport.serializeUser(function(user, done) {
    try{
        //log.debug("Session serialized for " + user);
        writelog("debug", "Session serialized for user with ID: " + user);
        done(null, user);
    }catch(err){
        writelog("error", "Error at serializing user: " + err);
        //log.error("Error at serializing user: " + err);
    }
});

passport.deserializeUser(function(id, done) {
    try {
        pool.getConnection(function(err, connection) {
            connection.query("select * from users where userID = ?;",[id], function(err, rows) {
                connection.release(); 
                if(err || !id){
                    writelog("error", "Error at deserializing user: " + err);
                    done(err, null);
                }else{
                    done(null, rows[0]);
                }
            });
        });
    } catch (err) {
        writelog("error", "Error at deserializing user: " + err);
        log.error("Error at deserializing user: " + err);
    }
});
try{
    passport.use('login', new LocalStrategy({
            username: 'username',
            password: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            pool.getConnection(function(err, connection) {
                var TokenGenerator = require('token-generator')({
                    salt: 'your secret ingredient for this magic recipe',
                    timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes
                });
                var token = TokenGenerator.generate();
                if (err) {
                    console.log("Error: " + err)
                    writelog("error", "Error during login: " + err);
                } else {
                    var query = "SELECT userID,userName FROM USERS WHERE username = ? AND password = ?; Update Users SET  authtoken = ? WHERE username = ? AND password = ? ;";
                    connection.query(query, [username,password,token,username,password], function(err, rows, fields) {
                        //console.log("us:",rows[1][0]["password"]);
                        connection.release(); //release the connection
                        if (err) {
                            console.log("Error: " + err)
                            writelog("error", "Error during login: " + err);
                            //log.error("Error during login: " + err);
                        }
                        if (!rows.length) {
                            console.log("Wrong user");
                            writelog("error", "Error: No user found.");
                            //log.error("Error: No user found.");
                            return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
                        }
                        console.log(rows[1]);
                        console.log(token+","+username+","+password);
                        /*if (!(rows[1][0]["password"] == password)) {
                            writelog("error", "Error: Wrong password.");
                            log.error("Error: Wrong password.");
                            return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
                        }*/
                        if(rows[0][0]){
                            var data = ({
                                "userID": rows[0][0]["userID"],
                                "userName": rows[0][0]["userName"],
                                "token": token
                            });
                            User = data;
                            console.log("user: ",data.userID)
                            writelog("debug", "User login succesful: " + User);
                            //log.debug("User login succesful: " + User);
                            return done(null, data.userID);
                        }else{
                            return done(null);
                        }

                    });
                }

            });
        }));

}catch(err){
    log.error("Error at passport login! " + err);
    console.log("Error at passport login! " + err);
}
try {
    app.put('/userlogout', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.body.userID;
        writelog("debug","UserID: "+ userID);
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Users SET authtoken = null WHERE userID = ?;", [userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    //log.debug("PUT/userlogout Token deleted for user with ID: " + userID);
                    writelog("debug", "PUT/userlogout Token deleted for user with ID: " + userID);
                    res.send(rows);
                } else {
                    //log.error("Error at endpoint PUT/userlogout " + err);
                    writelog("error", "Error at endpoint PUT/userlogout " + err);
                    res.send('Error');
                }
            });
            //connection.release(); //release the connection
        });
    });
} catch (err) {
    log.error("Error accessing PUT/userlogout endpoint! " + err);
    console.log("Error accessing PUT/userlogout endpoint! " + err);
}
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
            connection.query("SELECT userID, firstName, lastName, userName, email, permission, image FROM users ORDER BY userID desc; ", function(err, rows, fields) {
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
}/*
try {
    app.put('/userlogin', function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var TokenGenerator = require('token-generator')({
            salt: 'your secret ingredient for this magic recipe',
            timestampMap: 'abcdefghij', // 10 chars array for obfuscation proposes 
        });
        var token = TokenGenerator.generate();
        //console.log("tokenn:: "+token);
        var query = "SELECT userID,userName,email,authtoken FROM USER WHERE userName = ? AND password = ? ;";
        pool.getConnection(function(err, connection) {
            connection.query(query, [email, password], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    if (rows == "") {
                        log.error("Error at endpoint PUT/userlogin. Invalid e-mail or password. " + err);
                        writelog("error", "Error at endpoint PUT/userlogin. Invalid e-mail or password. " + err);
                        res.send("Error");
                    } else {
                        //console.log(rows[0])
                        try {
                            var data = JSON.stringify({
                                "userID": rows[0][0]["userID"],
                                "userName": rows[0][0]["userName"],
                                "email": rows[0][0]["email"],
                                "token": token
                            });
                            log.debug("PUT/userlogin Token inserted for user with e-mail: " + email);
                            writelog("debug", "PUT/userlogin Token inserted for user with e-mail: " + email);
                            rows[0].authtoken=token;
                            res.send(rows[0]);
                        } catch (err) {
                            log.error("Error at endpoint PUT/userlogin " + err);
                            writelog("error", "Error at endpoint PUT/userlogin " + err);
                            res.send('Error');
                        }
                    }
                } else {
                    log.error("Error at endpoint PUT/userlogin " + err);
                    writelog("error", "Error at endpoint PUT/userlogin " + err);
                    res.send('Error');
                }
            });
            //connection.release(); //release the connection
        });
    });
} catch (err) {
    log.error("Error accessing PUT/userlogin endpoint! " + err);
    console.log("Error accessing PUT/userlogin endpoint! " + err);
}*/
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
        var image = req.body.image;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Users SET userName=?, firstName=?, lastName=?, email=?, permission=?, image=? WHERE userID = ?;", [userName, firstName, lastName, email, permission, image, userID], function(err, rows, fields) {
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
    app.put('/users/myupdate', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.body.userID;
        var userName = req.body.userName;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var password = req.body.password;
        var image = req.body.image;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Users SET userName=?, firstName=?, lastName=?, email=?, password=?, image=?  WHERE userID = ?;", [userName, firstName, lastName, email, password, image, userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/users/myupdate " + userID);
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                        writelog("error", "Error at endpoint PUT/users/myupdate " + err);
                        res.send(err.message);
                } else if (!userName || !email ||!firstName || !lastName || !password) {
                    writelog("error", "Error at endpoint PUT/users/myupdate. Username or e-mail field is empty." + err);
                    res.send('Empty');
                }else {
                writelog("error", "Error at endpoint PUT/users/myupdate " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/users/myupdate endpoint! " + err);
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
            connection.query("SELECT * FROM places ORDER BY placeID desc;", function(err, rows, fields) {
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
    app.get('/place/datas/:placeID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.params.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT burgers.burgerID, burgers.burgerName, Burgers.placeID, burgers.image, burgers.visible from Burgers, Ratings, Places Where Burgers.placeID = ? group by burgers.burgerID;",[placeID], function(err, rows, fields) {
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
    app.get('/place/ratings/:placeID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.params.placeID;
        var query = "Select burgers.burgerID, burgers.burgerName, burgers.visible, "+
                        "avg(Ratings.pTaste) as pTaste, "+
                        "avg(Ratings.pPrepareTime) as pPrepareTime, "+
                        "avg(Ratings.pApperance) as pApperance, "+
                        "avg(Ratings.pTotal) as pTotal, "+
                        "count(ratings.pTotal) AS count "+
                        "From Ratings, Burgers Where burgers.burgerID = Ratings.burgerID AND burgers.placeID = ?  AND ratings.burgerID = burgers.burgerID  group by burgers.burgerName;"
        pool.getConnection(function(err, connection) {
            connection.query(query,[placeID], function(err, rows, fields) {
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

try {
    app.post('/places/post', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var body = req.body;
        var placeName = body.placeName;
        var phoneNumber = body.phoneNumber;
        var description = body.description;
        var image = body.image;
        var gpsX = body.gpsX;
        var gpsY = body.gpsY;
        var query = "INSERT INTO Places (placeName,phoneNumber,description,image,gpsX,gpsY) VALUES (?,?,?,?,?,?);";
        pool.getConnection(function(err, connection) {
            connection.query(query, [placeName,phoneNumber,description,image,gpsX,gpsY], function(err, rows, fields) {
                connection.release();
                if (!err) {
                    writelog("debug", "POST/places");
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                    writelog("error", "Error at endpoint POST/places. place name is already taken." + err);
                    res.send(err.message);
                } else if (!placeName || !description) {
                    writelog("error", "Error at endpoint POST/places. place or description field is empty." + err);
                    res.send('Empty');
                } else {
                    writelog("error", "Error at endpoint POST/places " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing POST/places endpoint! " + err);
}
try {
    app.put('/places/update', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.body.placeID;
        var placeName = req.body.placeName;
        var phoneNumber = req.body.phoneNumber;
        var description = req.body.description;
        var image = req.body.image;
        var gpsX = req.body.gpsX;
        var gpsY = req.body.gpsY;
        
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE places SET placeName=?, phoneNumber=?, description=?, image=?, gpsX=?, gpsY=? WHERE placeID = ?;", [placeName, phoneNumber, description, image, gpsX, gpsY, placeID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/places/update " + placeID);
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                        writelog("error", "Error at endpoint PUT/places/update " + err);
                        res.send(err.message);
                } else if (!placeName ||!description) {
                    writelog("error", "Error at endpoint PUT/places/update. Place name or description field is empty." + err);
                    res.send('Empty');
                }else {
                writelog("error", "Error at endpoint PUT/places/update " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/places/update endpoint! " + err);
}
try {
    app.delete('/places/:placeID', function(req, res) {
        var placeID = req.params.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("DELETE FROM places WHERE placeID = ?;", [placeID], function(err, rows, fields) {
                connection.release(); 
                if (!err) {
                    writelog("debug", "DELETE/places/" + placeID);
                    res.send("OK");
                } else {
                    writelog("error", "Error at endpoint DELETE/places/" + placeID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing DELETE/places/:placeID endpoint! " + err);
}
try {
    app.put('/places/invisible', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.body.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE places SET visible=0 WHERE placeID = ?;", [placeID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/places/invisible " + placeID);
                    res.send("OK");
                }else {
                writelog("error", "Error at endpoint PUT/places/invisible " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/places/invisible endpoint! " + err);
}
try {
    app.put('/places/visible', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var placeID = req.body.placeID;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE places SET visible=1 WHERE placeID = ?;", [placeID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/places/visible " + placeID);
                    res.send("OK");
                }else {
                writelog("error", "Error at endpoint PUT/places/visible " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/places/visible endpoint! " + err);
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

try {
    app.get('/burgers', function(req, res) {
        pool.getConnection(function(err, connection) {
            connection.query("SELECT burgers.burgerID, burgers.burgerName, places.placeName, places.placeID, burgers.description, burgers.image, burgers.visible "+
                            "FROM burgers, places WHERE burgers.placeID = places.placeID ORDER BY burgers.burgerID desc;", function(err, rows, fields) {
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
            connection.query("SELECT burgers.burgerID, burgers.burgerName, burgers.placeID, burgers.description, burgers.image, burgers.visible, "+
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
    app.post('/burgers/post', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var body = req.body;
        var burgerName = body.burgerName;
        var placeID = body.placeID;
        var description = body.description;
        var image = body.image;
        var query = "INSERT INTO Burgers (burgerName,placeID,description,image) VALUES (?,?,?,?);";
        pool.getConnection(function(err, connection) {
            connection.query(query, [burgerName,placeID,description,image], function(err, rows, fields) {
                connection.release();
                if (!err) {
                    writelog("debug", "POST/burgers");
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                    writelog("error", "Error at endpoint POST/burgers. Burger name is already taken." + err);
                    res.send(err.message);
                } else if (!burgerName || !description || !placeID) {
                    writelog("error", "Error at endpoint POST/burgers. Burger, place or description field is empty." + err);
                    res.send('Empty');
                } else {
                    writelog("error", "Error at endpoint POST/burgers " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing POST/burgers endpoint! " + err);
}
try {
    app.put('/burgers/update', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.body.burgerID;
        var burgerName = req.body.burgerName;
        var placeID = req.body.placeID;
        var description = req.body.description;
        var image = req.body.image;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Burgers SET burgerName=?, placeID=?, description=?, image=? WHERE burgerID = ?;", [burgerName, placeID, description, image, burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/burgers/update " + burgerID);
                    res.send("OK");
                } else if (err.code == "ER_DUP_ENTRY") {
                        writelog("error", "Error at endpoint PUT/burgers/update " + err);
                        res.send(err.message);
                } else if (!burgerName || !placeID ||!description) {
                    writelog("error", "Error at endpoint PUT/burgers/update. Username or e-mail field is empty." + err);
                    res.send('Empty');
                }else {
                writelog("error", "Error at endpoint PUT/burgers/update " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/burgers/update endpoint! " + err);
}
try {
    app.delete('/burgers/:burgerID', function(req, res) {
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("DELETE FROM burgers WHERE burgerID = ?;", [burgerID], function(err, rows, fields) {
                connection.release(); 
                if (!err) {
                    writelog("debug", "DELETE/burgers/" + burgerID);
                    res.send("OK");
                } else {
                    writelog("error", "Error at endpoint DELETE/burgers/" + burgerID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing DELETE/burgers/:burgerID endpoint! " + err);
}
try {
    app.put('/burgers/invisible', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.body.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Burgers SET visible=0 WHERE burgerID = ?;", [burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/burgers/invisible " + burgerID);
                    res.send("OK");
                }else {
                writelog("error", "Error at endpoint PUT/burgers/invisible " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/burgers/invisible endpoint! " + err);
}
try {
    app.put('/burgers/visible', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.body.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("UPDATE Burgers SET visible=1 WHERE burgerID = ?;", [burgerID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "PUT/burgers/visible " + burgerID);
                    res.send("OK");
                }else {
                writelog("error", "Error at endpoint PUT/burgers/visible " + err);
                res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing PUT/burgers/visible endpoint! " + err);
}
try {
    app.get('/ratings/:burgerID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT Ratings.ratingID, users.userName, users.userID, users.image, Ratings.pTaste, Ratings.pPrepareTime, Ratings.pApperance, Ratings.pTotal, Ratings.comment, Ratings.likes, Ratings.date "+
                            "FROM Ratings,users WHERE burgerID = ? AND Ratings.userID = users.userID;", [burgerID], function(err, rows, fields) {
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
    app.get('/ratingsUser/:userID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.params.userID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT Ratings.ratingID, Ratings.burgerID,  Burgers.burgerName, Ratings.pTaste, Ratings.pPrepareTime, Ratings.pApperance, Ratings.pTotal, Ratings.comment, Ratings.likes, Ratings.date "+
                            "FROM Ratings,users,burgers WHERE ratings.userID = ? AND Ratings.userID = users.userID  AND Burgers.burgerID = ratings.burgerID;", [userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/ratings/" + userID);
                    res.send(rows);
                } else {
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/ratings/:userID endpoint!" + err);
}

try {
    app.get('/ratings/:burgerID/:userID', function(req, res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        var userID = req.params.userID;
        var burgerID = req.params.burgerID;
        pool.getConnection(function(err, connection) {
            connection.query("SELECT ratingID FROM Ratings WHERE burgerID = ? AND userID = ?;", [burgerID,userID], function(err, rows, fields) {
                connection.release(); //release the connection
                if (!err) {
                    writelog("debug", "GET/ratings/" + burgerID + "/" + userID);
                    res.send(rows);
                } else {
                    res.send('Error');
                }
            });
            // connection.release(); //release the connection
        });
    });
} catch (err) {
    console.log("Error accessing GET/ratings/:burgerID/:userID endpoint!" + err);
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
    app.delete('/ratings/:ratingID', function(req, res) {
        var ratingID = req.params.ratingID;
        pool.getConnection(function(err, connection) {
            connection.query("DELETE FROM Likes WHERE ratingID = ?; DELETE FROM Ratings WHERE ratingID = ?;", [ratingID, ratingID], function(err, rows, fields) {
                connection.release(); 
                if (!err) {
                    writelog("debug", "DELETE/ratingID/" + ratingID);
                    res.send("OK");
                } else {
                    writelog("error", "Error at endpoint DELETE/ratingID/" + ratingID + " Error: " + err);
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing DELETE/ratingID/:ratingID endpoint! " + err);
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
try {
    app.get('/toplist/burgers/:type',function(req,res){
        res.setHeader("Access-Control-Allow-Origin", "*");
        var viewvpoint = "";
        console.log(req.params.type)
        switch (parseInt(req.params.type)) {
            case 1:
                viewvpoint = "pTaste";
                break;
            case 2:
                viewvpoint = "pPrepareTime";
                break;
            case 3:
                viewvpoint = "pApperance";
                break;
            case 4:
                viewvpoint = "pTotal";
                break;
        }
        var query = "Select burgers.burgerID, burgers.burgerName, burgers.visible, "+
                        " avg(Ratings.pTaste) as pTaste,"+ 
                        " avg(Ratings.pPrepareTime) as pPrepareTime, "+
                        " avg(Ratings.pApperance) as pApperance, "+
                        " avg(Ratings.pTotal) as pTotal "+
                    "From Ratings, Burgers Where burgers.burgerID = Ratings.burgerID group by burgers.burgerName order by "+viewvpoint+" desc;";
        console.log(query);
        pool.getConnection(function(err, connection) {
            connection.query(query, function(err, rows, fields) {
                connection.release();
                if (!err) {
                    writelog("debug", "GET/toplist/burgers/");
                    res.send(rows);
                } else {
                    res.send('Error');
                }
            });
        });
    });
} catch (err) {
    console.log("Error accessing GET/toplist/burgers endpoint!" + err);
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
    res.sendFile(__dirname + '/frontend/burgerlist.html');
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