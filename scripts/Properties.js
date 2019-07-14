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

const wordsToNumbers = require('words-to-numbers')

class Properties {

  constructor(name = null, id = null) {
    this.name = name
    this.id = id
  }

  parse(lines) {
    lines.shift()
    let properties = []

    for(line of lines) {
      let count = 1
      let rented = false
      let holiday = false
      let house = false
      let flat = false
      let farm = false
      let residential = false
      let commercial = false
      let location = null
      let shared = null

      if(line.text.match("(ii)")) {rented = true}
      if(line.text.match(/holiday/gi)) {holiday = true}
      if(line.text.match(/\bhouse\b|cottage/gi)) {house = true}
      if(line.text.match(/\bflat\b|apartment/gi)) {flat = true}
      if(line.text.match(/\bfarm\b/gi)) {farm = true}
      if(line.text.match(/residential/gi)) {residential = true}
      if(line.text.match(/commercial|\bshop\b/gi)) {commercial = true}
      if(line.text.match(/\bshared\b|\bshare\b/gi)) {shared = true}

      let count_match = line.text.match(/(four|eight|(?:fiv|(?:ni|o)n)e|t(?:wo|hree)|s(?:ix|even))(?! bedroomed| bedroom)/gi)
      count_match ? count = wordsToNumbers.wordsToNumbers(count_match[0]) : 1

      let location_regex = (/( in| near| at) (?!building|one |two |three |four |five|to |total |holdiday )(\w\w+)/gi)
      let location_match = location_regex.exec(line.text)
      location_match ? location = location_match[2] : "null"

      let property = {"text": line.text, "count": count, "location": location, "rented": rented, "holiday": holiday, "house": house, "flat": flat, "farm": farm, "residential": residential, "commercial": commercial}
      properties.push(property)
    }
    this.properties = properties
  }

  addAll(properties) {
    this.properties.forEach(property => this.add(property))
  }

  add(property) {
    let sql = "INSERT IGNORE INTO property(mp_id, mp_name, text, quantity, rented, holiday, house, flat, farm, residential, commercial, location) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
    let inserts = [this.id, this.name, property.text, property.count, property.rented, property.holiday, property.house, property.flat, property.farm, property.residential, property.commercial, property.location]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Properties
