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

class Visits {

  constructor(name = null, id = null) {
    this.name = name
    this.id = id
  }

  parse(lines) {
    lines.shift()
    let visits = []

    for(line of lines) {
      let donor = /Name of donor: (.+?) \|/gmi.exec(line.text)? /Name of donor: (.+?) \|/gmi.exec(line.text)[1] : null
      let donor_address = /Address of donor: (.+?) \|/gmi.exec(line.text) ? /Address of donor: (.+?) \|/gmi.exec(line.text)[1] : null
      let description = /Amount of donation.+?:(.+?)\|/gmi.exec(line.text) ? /Amount of donation.+?:(.+?)\|/gmi.exec(line.text)[1] : null
      let amount = /Amount of donation.+ £([\d,\.]+)/gmi.exec(line.text) ? /Amount of donation.+ £([\d,\.]+)/gmi.exec(line.text)[1].replace(",", "") : null
      let destination = /Destination of visit: (.+?) \|/gmi.exec(line.text) ? /Destination of visit: (.+?) \|/gmi.exec(line.text)[1] : null
      let purpose = /Purpose of visit: (.+?) \|/gmi.exec(line.text) ? /Purpose of visit: (.+?) \|/gmi.exec(line.text)[1] : null
      visits.push({"text": line.text, "donor": donor, "donor_address": donor_address, "description": description ,"amount": amount, "destination": destination, "purpose": purpose})
    }

    this.visits = visits
  }

  addAll() {
    this.visits.forEach(visit => this.add(visit))
  }

  add(visit) {
    let hash = md5(this.name + visit.text)

    let sql = "INSERT IGNORE INTO visits(mp_id, mp_name, text, donor, donor_address, description, amount, destination, purpose, hash) VALUES(?,?,?,?,?,?,?,?,?,?)"
    let inserts = [this.id, this.name, visit.text, visit.donor, visit.donor_address, visit.description, visit.amount, visit.destination, visit.purpose, hash]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Visits
