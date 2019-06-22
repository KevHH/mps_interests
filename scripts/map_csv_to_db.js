require('dotenv').config()

const util = require('util')
const mysql = require('mysql')
const csv = require('fast-csv')
const fs  = require('fs');

let pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_DATABASE,
})
pool.query = util.promisify(pool.query)

function add_to_db(row) {
  let first_name = row[1]
  let last_name = row[2]
  let party = row[3]
  let constit = row[4]

  let sql = "UPDATE mps set party = ?, constit = ? WHERE last_name LIKE ? AND first_name LIKE ?"
  let inserts = [party, constit, "%" + last_name + "%", "%" + last_name + "%"]
  sql = mysql.format(sql, inserts)
  return pool.query(sql)
}

(async function() {

  let mps_arr = []

  fs.createReadStream('csv/mps.csv')
    .pipe(csv.parse())
    .on('error', error => console.error(error))
    .on('data', row => add_to_db(row))

}())
