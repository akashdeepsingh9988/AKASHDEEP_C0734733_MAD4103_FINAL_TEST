var db = null;

// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("saveButton").addEventListener("click", saveButtonPressed);
document.getElementById("showAllButton").addEventListener("click", showAllPressed)

function connectToDatabase() {
  console.log("device is ready - connecting to database");
  if (window.cordova.platformId === 'browser') {
    db = window.openDatabase("cestar", "1.0", "Database for Cestar College app", 2*1024*1024);
  }
  else {
    var databaseDetails = {"name":"cestar.db", "location":"default"}
    db = window.sqlitePlugin.openDatabase(databaseDetails);
    console.log("done opening db");
  }

  if (!db) {
    alert("databse connection failed!");
    return false;
  }

  // 3. create relevant tables
  db.transaction(createTables)

}

function createTables(transaction) {
  var sql = "CREATE TABLE IF NOT EXISTS employee (id integer PRIMARY KEY AUTOINCREMENT, name text, dept text)"
  //var sql = "CREATE TABLE IF NOT EXISTS employee (name text, dept text)"
  transaction.executeSql(sql, [], createSuccess, createFail)
}

function createSuccess(tx, result) {

}
function createFail(error) {
  alert("Failure while creating table: " + error);
}




function saveButtonPressed(transaction) {
  console.log("save!!!");
  // get name and department from the user interface
  var n = document.getElementById("name").value;
  var d = document.getElementById("dept").value;

  db.transaction(function (transaction) {
      // save the values to the database
      var sql = "INSERT INTO employee (name, dept) VALUES (?,?)";
      
      
      transaction.executeSql(sql,[n,d], function(tx,result){
        alert("Insert success: " + JSON.stringify(result));
        showAllPressed()
      }, function(error){
        alert("Insert failed: " + error);
      });
    }
  );

}

function showAllPressed() {
  // clear the user interface
  document.getElementById("dbItems").innerHTML = "";

  db.transaction(function(transaction) {
    transaction.executeSql("SELECT * FROM employee", [],
      function (tx, results) {
        var numRows = results.rows.length;

        for (var i = 0; i < numRows; i++) {

          // to get individual items:
          var item = results.rows.item(i);
          console.log(item);
          console.log(item.name);

          // show it in the user interface
          document.getElementById("dbItems").innerHTML +=
              "<p>Name: " + item.name + "</p>"
            + "<p>Dept: " + item.dept + "</p>"
            + "<p>=======================</p>";
        }

      }, function(error){
      });
  });
}

/* DELETE statement
db.transaction(function(txn) {
  txn.executeSql("DROP TABLE employee",[],
      function(tx,results){console.log("Successfully Dropped")},
      function(tx,error){console.log("Could not delete")}
  );
});
*/