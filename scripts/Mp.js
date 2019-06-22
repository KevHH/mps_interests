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

class Mp {

  constructor(name) {
    this.name = name
  }

  makeName() {
    let name_array = /(.+?), (.+)/gi.exec(this.name)
    this.first_name = name_array[2]
    this.last_name = name_array[1]
  }

  async add() {
    this.makeName()

    let exists_data = await this.checkExists()
    let exists_id = exists_data[0] ? exists_data[0].id : null

    if(!exists_id) {
      let insert_data = await this.insert()
      return +insert_data.insertId
    }
    else {return +exists_id}
  }

  checkExists() {
    let sql = "SELECT id FROM mps WHERE name = ?"
    let inserts = [this.name]
    sql = mysql.format(sql, inserts)
    return pool.query(sql)
  }

  insert() {
    let sql = "INSERT INTO mps(name, first_name, last_name) VALUES(?,?,?)"
    let inserts = [this.name, this.first_name, this.last_name]
    sql = mysql.format(sql, inserts)
    return pool.query(sql)
  }

}

module.exports = Mp
