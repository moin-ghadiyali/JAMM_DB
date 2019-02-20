var express = require("express");
var ejs = require("ejs");
var tjs = require("templatesjs");
var path = require("path");
var session = require("express-session");
var fs = require("fs");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var mysql = require("mysql");
var alert = require("alert-node");
var jsalert = require("js-alert");
var url = require("url");
var Regex = require("regex");
var reload = require("reload");
var app = express();
var users;
var rows;
var area;
var areaRows;
var addAreaRow;
var printData;
var memData;
var memRow;
var memID;
var data_upd;
var data_upd_row;
var usersLoan;
var rowsLoan;
var userTotal1;
var userTotal2;
var userDetails;
var updateLoan;
var updateLoanRow;
var loanUserDetails;
var printLoanData;
var sumAmt;
var sumInt;
var sumOfAmount;
var sumOfInterest;
var totalLoanPaid;
var totalLoanInt;
var totalMemInt;
var totalMemPaid;
var deletedMemb;
var deletedRow;
var deletedLoanMemb;
var deletedLoanRow;
var graphRes;
var graphRow;
var graphRowLoan;
var gRowL;

const log = require("node-file-logger");

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sampledb',
    multipleStatements: true
});

connection.connect(function(error) {
    if(!!error) {
        console.log("Error");
    } else {
        console.log("Connected!");
    }
});

app.post('/login_details', function (req, res) {
    var userName = req.body.username;
    var passWord = req.body.password;

        var sql_login = "select username, password from login where username = '" + userName + "' and password = '" + passWord + "';";
        connection.query(sql_login, (err, result) => {
            if(err) throw err;
            var len = Buffer.from(result);
            var results = len.length;
            if(results>0) {
                req.session.loggedin = true;
                req.session.userName = userName;
                res.redirect("/home");
            } else {
                res.redirect("/");
            }
            res.end();
        });
});

app.post('/members', function (req, res) {
    var id = req.body.id;
    var name = req.body.name;
    var idate = req.body.idate;
    var fdate = req.body.fdate;
    var cityname = req.body.cityName.toLowerCase();

    var sql_check = "select * from allmembers where id = '" + id + "';";

    connection.query(sql_check, (err1, result1) => {
        if(err1) throw err1;
        var len = Buffer.from(result1);
        var row = len.length;
        if(row > 0) {
            alert("Member Already Exists!");
            res.redirect("/displayAll");
        } else {
            var sql_create = "CREATE TABLE mem_" + id + " (month INT(10), pdate DATE, amount REAL, interest REAL);";
            var sql_insert_all = "insert into allmembers values (?, ?, DATE(?), DATE(?), ?, 'mem_" + id +"');";

            connection.query(sql_create + sql_insert_all, [id, name, idate, fdate, cityname], function(err, result) {
            if (err) {console.log(err);};
                console.log("Inserted Successfully");
                res.redirect("/displayAll");
            });
        }
    });
});

app.post('/loan', (req, res) => {
    var id = req.body.id;
    var name = req.body.name;
    var idate = req.body.idate;
    var fdate = req.body.fdate;
    var cityname = req.body.cityName.toLowerCase();
    var amount = req.body.amount;

    var sql_check = "select * from loan where id = '" + id + "';";

    connection.query(sql_check, (err1, result1) => {
        if(err1) throw err1;
        var len = Buffer.from(result1);
        var row = len.length;
        if(row>0) {
            alert("Member Already Exists!");
            res.redirect("/displayLoan");
        } else {
            var sql_create = "CREATE TABLE loan_" + id + " (month INT(10), pdate DATE, amount REAL, interest REAL, intpercent REAL);";
            var sql_insert_loan = "insert into loan values (?, ?, ?, ?, ?, ?, 'mem_" + id + "', 'loan_" + id + "');";
            
            connection.query(sql_create + sql_insert_loan, [id, name, idate, fdate, cityname, amount], (err, result) => {
            if(err) {console.log(err);};
                console.log(result);
                res.redirect("/displayLoan");
            });
        }
    });
});

// app.get("/members/:cityName", function (req, res) {
//     var sql_select = 'select * from ' + req.params.cityName + ' order by name asc;';

//     connection.query(sql_select, function (err, result) {
//         if(err) throw err;
//         else {
//             console.log(result);
//             var len = Buffer.from(result);
//             var row = len.length;
//             var jsonObj = result;
//             if(row>0) {
//                 users = jsonObj;
//                 rows = row;
//                 res.redirect("/members");
//             } else {
//                 users = null;
//             }
//         }
//     });
// });

app.get("/members/:cityName", function (req, res) {
    var sql_select = 'select ' + req.params.cityName + ' from allmembers order by name asc;';

    connection.query(sql_select, function (err, result) {
        if(err) throw err;
        else {
            console.log(result);
            var len = Buffer.from(result);
            var row = len.length;
            var jsonObj = result;
            if(row>0) {
                users = jsonObj;
                rows = row;
                res.redirect("/members");
            } else {
                users = null;
            }
        }
    });
});

// connection.query("select * from investors", function (err, result) {
//     if(err) throw err;
//     else {
//         console.log(result);
//         var len = Buffer.from(result);
//         var row = len.length;
//         var jsonObj = result;
//         if(row>0) {
//             users = jsonObj;
//             rows = row;
//         } else {
//             users = null;
//         }
//     }
// });

// app.post("/citySelect", function (req, res) {
//     var selectCity = req.body.kalyan;
//     var sql_citySelect = 'select * from ?';

//     connection.query(sql_citySelect, [selectCity], function (err, result) {
//         if(err) throw err;
//         else {
//             console.log(result);
//             var len = Buffer.from(result);
//             var row = len.length;
//             var jsonObj = result;
//             if(row>0) {
//                 users = jsonObj;
//                 rows = row;
//                 res.redirect('/members');
//             } else {
//                 users = null;
//             }
//         }
//     });
// });

app.get("/displayAll", function(req, res) {
    var sql_all = "select * from allmembers order by name asc";

    connection.query(sql_all, function(err, result) {
        if(err) throw err;
        else {
            var len = Buffer.from(result);
            var row = len.length;
            var jsonObj = result;
            if(row>0) {
                users = jsonObj;
                rows = row;
                res.redirect('/members');
            } else {
                users = null;
            }
        }
    });
});

app.get('/displayLoan', (req, res) => {
    var sql_loan = "select * from loan order by name asc";

    connection.query(sql_loan, (err, result) => {
        if(err) throw err;
        else {
            var len = Buffer.from(result);
            var row = len.length;
            var jsonObj = result;
            if(row>0) {
                usersLoan = jsonObj;
                rowsLoan = row;
                res.redirect('/loan');
            } else {
                usersLoan = null;
            }
        }
    });
});

// app.post("/area", function (req, res) {
//     var cityName = req.body.cityName;

//     var sql_insert = "insert into area values (" + cityName + ");";
//     // var sql_create = "create table " + cityName + " (name VARCHAR(30) NOT NULL, date DATE(12) NOT NULL, fdate DATE(12) NOT NULL, amount NUMBER(10) NOT NULL);";

//     connection.query(sql_insert, function (err, result) {
//         console.log(result);
//         addAreaRow = result;
//         addNewRow(addAreaRow);
//     });
// });
// function addNewRow(addAreaRow) {
//     var newRow = addAreaRow;
//     var tableTr = "<table><tr><td>"+newRow+"</td></tr></table>";
//     var tableName = document.getElementById("areaTable");
    
//     tableName.appendChild(tableTr);
// }

// connection.query("select * from area", function (err, result) {
//     if(err) throw err;
//     else {
//         var len = Buffer.from(result);
//         var row = len.length;
//         var areaDet = result;
//         if(row>0) {
//             area = areaDet;
//             areaRows = row;
//         } else {
//             area = null;
//         }
//     }
// });

// app.get("/sortByName", function (req, res) {
//     var sql_sort = "select * from investors order by name asc;";

//     connection.query(sql_sort, function (err, result) {
//         if(err) throw err;
//         else {
//             var len = Buffer.from(result);
//             var row = len.length;
//             var jsonObj = result;
//             if(row>0) {
//                 users = jsonObj;
//                 rows = row;
//                 res.redirect('/members');
//             }
//         }
//     });
// });

// app.get("/sortByNumber", function (req, res) {
//     var sql_sort = "select * from investors order by amount asc;";

//     connection.query(sql_sort, function (err, result) {
//         if(err) throw err;
//         else {
//             var len = Buffer.from(result);
//             var row = len.length;
//             var jsonObj = result;
//             if(row>0) {
//                 users = jsonObj;
//                 rows = row;
//                 res.redirect('/members');
//             }
//         }
//     });
// });

// app.get("/sortByDate", function (req, res) {
//     var sql_sort = "select * from investors order by date asc;";

//     connection.query(sql_sort, function (err, result) {
//         if(err) throw err;
//         else {
//             var len = Buffer.from(result);
//             var row = len.length;
//             var jsonObj = result;
//             if(row>0) {
//                 users = jsonObj;
//                 rows = row;
//                 res.redirect('/members');
//             }
//         }
//     });
// });

app.post("/search", function (req, res) {
    var search = req.body.search;
    var sql_search = 'select * from allmembers where id like "%' + search + '%" or name like "%'+ search +'%" or cityname like "%' + search + '%";';
    
    connection.query(sql_search, function (err, result) {
        if(err) throw err;
        else {
            var len = Buffer.from(result);
            var row = len.length;
            var jsonObj = result;
            if(row>0) {
                users = jsonObj;
                rows = row;
                res.redirect('/members');
            } else {
                users = null;
                rows = 0;
                res.redirect('/members');
            }
        }
    });
});

app.post("/searchLoan", function (req, res) {
    var searchLoan = req.body.searchForLoan;
    var sql_search_loan = 'select * from loan where id like "%' + searchLoan + '%" or name like "%'+ searchLoan +'%" or cityname like "%' + searchLoan + '%";';
    
    connection.query(sql_search_loan, function (err, result) {
        if(err) throw err;
        else {
            console.log(result);
            var len = Buffer.from(result);
            var row = len.length;
            var jsonObj = result;
            if(row>0) {
                usersLoan = jsonObj;
                rowsLoan = row;
                res.redirect('/loan');
            } else {
                usersLoan = null;
                rowsLoan = 0;
                res.redirect('/loan');
            }
        }
    });
});

app.get("/print/:name", function (req, res) {
    var sql_print = "select * from allmembers where name = ?;";

    connection.query(sql_print, [req.params.name], function(err, result) {
        if(err) throw err;
        else {
            console.log(result);
            printData = result;

            var sql_mem_det = "select memid from allmembers where name = ?;";

            connection.query(sql_mem_det, [req.params.name], (err1, result1) => {
                if(err1) throw err1;
                var printMemID = result1;
                console.log(printMemID[0].memid);
                
                var sql_get_amount = "select max(amount) as sumOfAmount from " + printMemID[0].memid + ";";
                var sql_get_interest = "select sum(interest) as sumOfInterest from " + printMemID[0].memid + ";";

                connection.query(sql_get_amount + sql_get_interest, (err2, result2) => {
                    if(err2) throw err2;
                    console.log(result2[0]);
                    console.log(result2[1]);
                    sumOfAmount = result2[0];
                    sumOfInterest = result2[1];
                    res.redirect("/print");
                });
            });
        }
    });
});

app.get("/delete/:name", function(req, res) {
    var sql_delete_insert = "insert into deletedmembers select * from allmembers where name = ?;delete from allmembers where name = ?;";

    connection.query(sql_delete_insert, [req.params.name, req.params.name], function(err, result) {
        if(err) throw err;
        else {
            console.log("Deleted Successfully!");
            res.redirect("/displayAll");
        }
    });
});

app.get("/update/:memid", (req, res) => {
    var sql_update = "select * from " + req.params.memid + " order by month asc;";

    connection.query(sql_update, (err, result) => {
        if(err) throw err;
        else {
            var dataLen = Buffer.from(result);
            memRow = dataLen.length;
            memData = result;
            memID = req.params.memid;
            
            var sql_get_details = "select * from allmembers where memid = '" + req.params.memid + "';";
            
            connection.query(sql_get_details, (err1, result1) => {
                if(err1) throw err1;
                userDetails = result1;
                
                var sql_get_total = "select max(amount) as max from " + req.params.memid + ";";
                var sql_total_int = "select sum(interest) as sum from " + req.params.memid + ";";
                
                connection.query(sql_get_total + sql_total_int, (err2, result2) => {
                    if(err2) throw err2;
                    userTotal1 = result2[0];
                    userTotal2 = result2[1];
                    console.log(userTotal1);
                    console.log(userTotal2);
                    res.redirect("/update");
                });
            });
        }
    });
});

// app.get("/getDetails/:memID", (req, res) => {
//     var sql_get_details = "select name from allmembers where memid = '" + req.params.memID + "';";

//     connection.query(sql_get_details, (err, result) => {
//         if(err) throw err;
//         if(result.length>0) {
//             console.log(result);
//             userDetails = result;
//         } else {
//             userDetails = "Null";
//         }
//     });
// });

app.post("/updateData/:memID", (req, res) => {
    var month = req.body.month;
    var date = req.body.date;
    var amount = req.body.amount;
    var interest = (amount - 1000)/100;

    var sql_check = "select * from " + req.params.memID + " where month = '" + month + "';";

    connection.query(sql_check, (err1, result1) => {
        if(err1) throw err1;
        var len = Buffer.from(result1);
        var row = len.length;
        if(row>0) {
            alert("Installment Already Exists!");
            res.redirect("/update");
        } else {
            var sql_updateDB = "insert into " + req.params.memID + " values (?, ?, ?, ?);";
            var sql_graph = "insert into memgraph values (?, ?, ?);";
    
            connection.query(sql_updateDB + sql_graph, [month, date, amount, interest, date, req.params.memID, amount], (err, result) => {
                if(err) throw err;
                else {
                    console.log(result);
                    console.log("Inserted Succesfully!");
                    res.redirect("/update");
                }
            });
        }
    });
});

app.get("/deleteDue/:memID/:month/:date", (req, res) => {
    var sql_delete_due = "delete from " + req.params.memID + " where month = '" + req.params.month +"';";

    connection.query(sql_delete_due, (err, result) => {
        if(err) throw err;
        console.log("Deleted!");
        console.log(result);
        
        var sql_delete_main = "delete from memgraph where date = '" + req.params.date + "' and memid = '" + req.params.memID + "';";

        connection.query(sql_delete_main, (err1, result1) => {
            if(err1) throw err1;
            console.log(result1);
            res.redirect("/update");
        });
    });
});

// app.get("/citySelect", (req, res) => {
//     var sql_city = "select * from allmembers where cityname = '" + req.body.selectCity + "';";

//     connection.query(sql_city, (err, result) => {
//         if(err) throw err;
//         else {
//             var len = Buffer.from(result);
//             rows = len.length;
//             users = result;
//             res.redirect("/members");
//         }
//     });
// });

// app.get("/update/:amount", (req, res)=>{
//     var sql_update = "select * from ?;";

//     connection.query(sql_update, [req.params.amount], (err, result)=>{
//         if(err) throw err;
//         else {
//             var len_res = Buffer.from(result);
//             var row_res = len_res.length;
//             if(row_res>0) {
//                 data_upd = result;
//                 data_upd_row = row_res;
//                 res.redirect("/members");
//             }
//         }
//     });
// });

app.get("/updateLoan/:loanid", (req, res) => {
    var loanid = req.params.loanid;
    var sql_update_loan = "select * from " + loanid + ";";

    connection.query(sql_update_loan, (err, result) => {
        if(err) throw err;
        var len = Buffer.from(result);
        updateLoanRow = len.length;
        updateLoan = result;
        loanID = loanid;
        
        var sql_get_details = "select * from loan where loanid = '" + loanid + "';";

        connection.query(sql_get_details, (err1, result1) => {
            if(err1) throw err1;
            loanUserDetails = result1;
            
            var sql_get_total = "select sum(amount) as sumAmount from " + loanid + ";";
            var sql_total_int = "select sum(interest) as sumInterest from " + loanid + ";";

            connection.query(sql_get_total + sql_total_int, (err2, result2) => {
                if(err2) throw err2;
                sumAmt = result2[0];
                sumInt = result2[1];
                console.log(sumAmt);
                console.log(sumInt);
                res.redirect("/updateLoan");
            });
        });
    });
});

app.post("/updateLoan/:loanid", (req, res) => {
    var loanid = req.params.loanid;
    var month = req.body.month;
    var date = req.body.date;
    var amount = req.body.amount;
    var interest = req.body.interest;
    var installment_int = (interest/100)*amount;
    var inst = amount/20;
    var inst_due = inst + installment_int;

    var sql_check = "select * from " + loanid + " where month = '" + month + "';";
    
    connection.query(sql_check, (err1, result1) => {
        if(err1) throw err1;
        var len = Buffer.from(result1);
        var row = len.length;
        if(row>0) {
            alert("Installment Already Exists!");
            res.redirect("/updateLoan");
        } else {
            var sql_insert_loan = "insert into " + loanid + " values (?, ?, ?, ?, ?);";
            var sql_graph = "insert into loangraph values (?, ?, ?);";

            connection.query(sql_insert_loan + sql_graph, [month, date, inst_due, installment_int, interest, date, loanid, inst_due], (err, result) => {
                if(err) throw err;
                console.log(result);
                res.redirect("/updateLoan");
            });
        }
    });
});

app.get("/deleteLoan/:name", function(req, res) {
    var sql_delete_insert = "insert into deletedloan select * from loan where name = ?; delete from loan where name = ?;";

    connection.query(sql_delete_insert, [req.params.name, req.params.name], function(err, result) {
        if(err) throw err;
        else {
            console.log("Deleted Successfully!");
            res.redirect("/loan");
        }
    });
});

app.get("/deleteDueLoan/:loanid/:month", function(req, res) {
    var sql_delete_insert = "delete from " + req.params.loanid + " where month = '" + req.params.month + "';";

    connection.query(sql_delete_insert, function(err, result) {
        if(err) throw err;
        else {
            console.log("Deleted Successfully!");
            res.redirect("/updateLoan");
        }
    });
});

app.get("/printLoan/:id", function (req, res) {
    var sql_print = "select * from loan where id = ?;";

    connection.query(sql_print, [req.params.id], function(err, result) {
        if(err) throw err;
        else {
            console.log(result);
            printLoanData = result;
            
            var sql_get_details = "select memid, loanid from loan where id = '" + req.params.id + "';";

            connection.query(sql_get_details, (err1, result1) => {
                if(err1) throw result1;
                console.log(result1);
                var printMemId = result1;
                
                var sql_get_loan = "select sum(amount) as loanAmount from " + printMemId[0].loanid + ";";
                var sql_get_loan_int = "select sum(interest) as loanInt from " + printMemId[0].loanid + ";";
                var sql_get_mem = "select max(amount) as memAmount from " + printMemId[0].memid + ";";
                var sql_get_mem_int = "select sum(interest) as memInt from " + printMemId[0].memid + ";";

                connection.query(sql_get_loan + sql_get_loan_int + sql_get_mem + sql_get_mem_int, (err2, result2) => {
                    if(err2) throw err2;
                    totalLoanPaid = result2[0];
                    totalLoanInt = result2[1];
                    totalMemPaid = result2[2];
                    totalMemInt = result2[3];
                    console.log(result2);
                    res.redirect("/printLoan");
                });
            });
        }
    });
});

app.get("/deletedMem", (req, res) => {
    var sql_deleted_mem = "select * from deletedmembers;"

    connection.query(sql_deleted_mem, (err, result) => {
        if(err) throw err;
        console.log(result);
        var len = Buffer.from(result);
        deletedRow = len.length;
        deletedMemb = result;
        res.redirect('/deletedMembers');
    });
});

app.get("/deletedLoanMem", (req, res) => {
    var sql_deleted_mem = "select * from deletedloan;"

    connection.query(sql_deleted_mem, (err, result) => {
        if(err) throw err;
        console.log(result);
        var len = Buffer.from(result);
        deletedLoanRow = len.length;
        deletedLoanMemb = result;
        res.redirect('/deletedMembers');
    });
});

app.get("/recover/:loanid", (req, res) => {
    var loanid = req.params.loanid;

    var sql_recover = "insert into loan select * from deletedloan where loanid = '" + loanid + "';";
    var sql_delete = "delete from deletedloan where loanid = '" + loanid + "';";

    connection.query(sql_recover + sql_delete, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log("Recovered Successfully!");
        res.redirect("/loan");
    });
});

app.get("/recoverMem/:memid", (req, res) => {
    var memid = req.params.memid;

    var sql_recover = "insert into allmembers select * from deletedmembers where memid = '" + memid + "';";
    var sql_delete = "delete from deletedloan where loanid = '" + memid + "';";

    connection.query(sql_recover + sql_delete, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log("Recovered Successfully!");
        res.redirect("/members");
    });
});

app.post("/graphDet", (req, res) => {
    var graphMonth = req.body.graphMonth;
    var graphYear = req.body.graphYear;

    // var sql_dates = "select ";
    var sql_graph = "select month(date) from memgraph where month(date) = '" + graphMonth + "' and year(date) = '" + graphYear + "';";
    var sql_graph_loan = "select sum(amount) as sumLoan from loangraph where month(date) = '" + graphMonth + "' and year(date) = '" + graphYear + "';";

    connection.query(sql_graph + sql_graph_loan, (err, result) => {
        if(err) throw err;
        var len = Buffer.from(result[0]);
        var lenLoan = Buffer.from(result[1]);
        graphRow = len.length;
        gRowL = lenLoan.length;
        graphRowLoan = result[1];
        graphRes = result;
        console.log(result);
        res.redirect("/graph");
    });
});

app.get('/', function (req, res) {
    res.render('login');
});
app.get('/home', function (req, res) {
    if(req.session.loggedin) {
        res.render('index');
    } else {
        res.render('login');
    }
});
app.get('/members', function (req, res) {
    if(req.session.loggedin) {
        res.render('members', {
            title: "All Users",
            users: users,
            rows: rows 
        });
    } else {
        res.render('login');
    }
    // res.render('members', {
    //     title: "All Users",
    //     users: users,
    //     rows: rows
    // });
});
app.get('/schemes', function (req, res) {
    if(req.session.loggedin) {
        res.render('schemes');
    } else {
        res.render('login');
    }
});
app.get('/print', function (req, res) {
    if(req.session.loggedin) {
        res.render('print', {
            printData: printData,
            sumOfAmount: sumOfAmount,
            sumOfInterest: sumOfInterest
        });
    } else {
        res.render('login');
    }
    // res.render('print', {
        // printData: printData,
        // sumOfAmount: sumOfAmount,
        // sumOfInterest: sumOfInterest
    // });
});
app.get('/printLoan', (req, res) => {
    if(req.session.loggedin) {
        res.render('printLoan', {
            printLoanData: printLoanData,
            totalLoanPaid: totalLoanPaid,
            totalLoanInt: totalLoanInt,
            totalMemInt: totalMemInt,
            totalMemPaid: totalMemPaid
        });
    } else {
        res.render('login');
    }
    // res.render('printLoan', {
        // printLoanData: printLoanData,
        // totalLoanPaid: totalLoanPaid,
        // totalLoanInt: totalLoanInt,
        // totalMemInt: totalMemInt,
        // totalMemPaid: totalMemPaid
    // });
});
app.get('/update', function (req, res) {
    if(req.session.loggedin) {
        res.render('update', {
            memData: memData,
            memRow: memRow,
            memID: memID,
            userDetails: userDetails,
            userTotal1: userTotal1,
            userTotal2: userTotal2
        });
    } else {
        res.render('login');
    }
    // res.render('update', {
    //     memData: memData,
    //     memRow: memRow,
    //     memID: memID,
    //     userDetails: userDetails,
    //     userTotal1: userTotal1,
    //     userTotal2: userTotal2
    // });
});
app.get('/loan', (req, res)=>{
    if(req.session.loggedin) {
        res.render('loan', {
            usersLoan: usersLoan,
            rowsLoan: rowsLoan
        });
    } else {
        res.render('login');
    }
    // res.render('loan', {
    //     usersLoan: usersLoan,
    //     rowsLoan: rowsLoan
    // });
});
app.get('/updateLoan', (req, res) => {
    if(req.session.loggedin) {
        res.render('updateLoan', {
            updateLoan: updateLoan,
            updateLoanRow: updateLoanRow,
            loanUserDetails: loanUserDetails,
            loanID: loanID,
            sumAmt: sumAmt,
            sumInt, sumInt
        });
    } else {
        res.render('login');
    }
    // res.render('updateLoan', {
    //     updateLoan: updateLoan,
    //     updateLoanRow: updateLoanRow,
    //     loanUserDetails: loanUserDetails,
    //     loanID: loanID,
    //     sumAmt: sumAmt,
    //     sumInt, sumInt
    // });
});
app.get('/graph', (req, res) => {
    if(req.session.loggedin) {
        res.render('graph', {
            graphRes: graphRes,
            graphRow: graphRow,
            graphRowLoan: graphRowLoan,
            gRowL: gRowL
        });
    } else {
        res.render('login');
    }
    // res.render('graph', {
    //     graphRes: graphRes,
    //     graphRow: graphRow,
    //     graphRowLoan: graphRowLoan,
    //     gRowL: gRowL
    // });
});
app.get('/deletedMembers', (req, res) => {
    if(req.session.loggedin) {
        res.render('deletedMembers', {
            deletedMemb: deletedMemb,
            deletedRow: deletedRow
        });
    } else {
        res.render('login');
    }
    // res.render('deletedMembers', {
    //     deletedMemb: deletedMemb,
    //     deletedRow: deletedRow
    // });
});
app.get('/deletedLoanMembers', (req, res) => {
    if(req.session.loggedin) {
        res.render('deletedLoanMembers', {
            deletedLoanMemb: deletedLoanMemb,
            deletedLoanRow: deletedLoanRow
        });
    } else {
        res.render('login');
    }
    // res.render('deletedLoanMembers', {
    //     deletedLoanMemb: deletedLoanMemb,
    //     deletedLoanRow: deletedLoanRow
    // });
});
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

reload(app);

app.listen(3000, function (error) {
    if(!!error) {
        log.Error("Error while starting Server", "app", "listen");
    } else {
        log.Info("Server Started and listening to port 3000");
    }
});