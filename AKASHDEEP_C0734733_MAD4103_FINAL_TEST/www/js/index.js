var db = null;

// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("insert-hero").addEventListener("click", saveButtonPressed);
document.getElementById("show-heros").addEventListener("click", showAllPressed)

function connectToDatabase() {
  console.log("device is ready - connecting to database");
  if (window.cordova.platformId === 'browser') {
    db = window.openDatabase("superb", "1.0", "Database for super rescue agency app", 2*1024*1024);
  }
  else {
    var databaseDetails = {"name":"superb.db", "location":"default"}
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
  var sql = "CREATE TABLE IF NOT EXISTS heroes (id integer PRIMARY KEY AUTOINCREMENT, name text, isAvailable integer)";
  transaction.executeSql(sql, [], createSuccess, createFail)
}

function createSuccess(tx, result) {

}
function createFail(error) {
  alert("Failure while creating table: " + error);
}




function saveButtonPressed(transaction) {
  console.log("save!!!");
  db.transaction(function (transaction) {
      // save the values to the database
      var sql = "INSERT INTO heroes (name, isAvailable) VALUES ('Spiderman',1), ('Thor',1), ('Captain America',0), ('Wonder Women',0)";
      
      transaction.executeSql(sql,[], function(tx,result){
        alert("Insert success: " + JSON.stringify(result));
        //showAllPressed()
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
    transaction.executeSql("SELECT * FROM heroes", [],
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
            + "<p>Available for help : " + item.isAvailable + "</p>"
            + "<p>=======================</p>";
        }

      }, function(error){
      });
  });
}