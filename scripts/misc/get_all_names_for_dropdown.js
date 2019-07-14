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
  let sql = "SELECT id, first_name, last_name, party, constit from mps order by last_name"
  sql = mysql.format(sql)
  return pool.query(sql)
}

(async function() {
  let mps = await select()
  mps.forEach( mp => {
    console.log("<option value=" + mp.id + ">" + mp.first_name + mp.last_name + " (" + mp.constit + ")" + "</option>")
  })
}())
