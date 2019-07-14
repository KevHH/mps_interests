require('dotenv').config()

const util = require('util')
const mysql = require('mysql')

let pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_DATABASE,
})
pool.query = util.promisify(pool.query)

function select() {
  let sql = "SELECT * FROM (SELECT CONCAT(mps.first_name, mps.last_name) as 'id', mps.party as 'party', SUM(pay) as value FROM jobs LEFT JOIN mps ON mp_id = mps.id GROUP BY mp_id) as q WHERE value > 0"
  sql = mysql.format(sql)
  return pool.query(sql)
}

(async function() {
  let pay = await select()
  console.log(JSON.stringify(pay))
}())
