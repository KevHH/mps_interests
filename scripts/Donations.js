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

class Donations {

  constructor(name = null, id = null) {
    this.name = name
    this.id = id
  }

  parse(lines) {
    lines.shift()
    let donations = []

    for(line of lines) {
      let donor = /Name of donor: (.+?) \|/gmi.exec(line.text)? /Name of donor: (.+?) \|/gmi.exec(line.text)[1] : null
      let donor_address = /Address of donor: (.+?) \|/gmi.exec(line.text) ? /Address of donor: (.+?) \|/gmi.exec(line.text)[1] : null
      let description = /Amount of donation.+?:(.+?)\|/gmi.exec(line.text) ? /Amount of donation.+?:(.+?)\|/gmi.exec(line.text)[1] : null
      let amount = /Amount of donation.+ £([\d,\.]+)/gmi.exec(line.text) ? /Amount of donation.+ £([\d,\.]+)/gmi.exec(line.text)[1].replace(",", "") : null
      let donor_status = /Donor status: (.+?) \|/gmi.exec(line.text) ? /Donor status: (.+?) \|/gmi.exec(line.text)[1] : null
      donations.push({"text": line.text, "donor": donor, "donor_address": donor_address, "description": description ,"amount": amount, "donor_status": donor_status})
    }

    this.donations = donations
  }

  addAll() {
    this.donations.forEach(donation => this.add(donation))
  }

  add(donation) {
    let hash = md5(this.name + donation.text)

    let sql = "INSERT IGNORE INTO donations(mp_id, mp_name, text, donor, donor_address, description, amount, donor_status, hash) VALUES(?,?,?,?,?,?,?,?,?)"
    let inserts = [this.id, this.name, donation.text, donation.donor, donation.donor_address, donation.description, donation.amount, donation.donor_status, hash]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Donations
