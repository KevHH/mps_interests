require('dotenv').config()

const util = require('util')
const mysql = require('mysql')
const md5 = require('md5')

let pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_DATABASE,
})
pool.query = util.promisify(pool.query)

class Text {

  constructor(id, name) {
    this.id = id
    this.name = name
  }

  addAll(sections) {
    sections.forEach(section => {
      if(section.text != section.section) {
        this.add(section)
      }
    })
  }

  add(section) {
    let hash = md5(this.name + section.text)

    let sql = "INSERT IGNORE INTO text(mp_id, mp_name, section, text, hash) VALUES(?,?,?,?,?)"
    let inserts = [this.id, this.name, section.section, section.text, hash]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Text
