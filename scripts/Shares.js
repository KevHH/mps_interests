require('dotenv').config()

const util = require('util')
const md5 = require('md5')
const mysql = require('mysql')

let pool = mysql.createPool({
  connectionLimit : 10,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_DATABASE,
})
pool.query = util.promisify(pool.query)

class Shares {

  constructor(name = null, id = null, seventyk = false) {
    this.name = name
    this.id = id
    this.seventyk = seventyk
  }

  parse(lines) {
    lines.shift()
    let shares = []
    let company = null
    let description = null
    let registered = null
    let trading = true

    for(line of lines) {
      company = null
      description = null
      registered = null
      trading = true

      let info_regex = (/^(.+?)[;,\.](.+)/gi)
      let info_match = info_regex.exec(line.text)
      if(info_match) {
        company = info_match[1]
        description = info_match[2]
        registered = info_match[3]
      }
      if(line.text.match(/not trading/gi)) {trading = false}
      shares.push({"text": line.text, "company": company, "description": description, "registered": registered, "trading": trading })
    }

    this.shares = shares
    //console.log(shares)
  }

  addAll() {
    this.shares.forEach(share => this.add(share))
  }

  add(share) {
    let hash = md5(this.name + share.company + share.description)

    let sql = "INSERT IGNORE INTO shares(mp_id, mp_name, text, company, description, trading, 70k, hash) VALUES(?,?,?,?,?,?,?,?)"
    let inserts = [this.id, this.name, share.text, share.company, share.description, share.trading, this.seventyk, hash]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Shares
