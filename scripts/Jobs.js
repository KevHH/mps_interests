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

const wordsToNumbers = require('words-to-numbers')

class Jobs {

  constructor(name = null, id = null) {
    this.name = name
    this.id = id
  }

  parse(lines) {
    lines.shift()
    let jobs = []
    let job_title = null
    let job_info = null
    let employer = null
    let pay = 0

    for(line of lines) {
      if(line.class == "indent") {
        job_title = line.text
        job_info = null
        employer = null
        pay = 0
      }
      else if(line.class == "indent2") {
        job_info = line.text
        pay = 0
      }
      let employer_regex = (/payments (received )?from (.*?),/gi)
      let employer_match = employer_regex.exec(line.text)
      employer_match ? employer = employer_match[2] : "null"

      let pay_year_regex = /£([\d,\.]+)( gross a | \(gross\) a | a | per | plus VAT a | \(plus VAT\) a | )(year|annum|annually)/gi
      let pay_year_match = pay_year_regex.exec(line.text)
      if(pay_year_match) {pay = +Number(pay_year_match[1].replace(",","").replace(/\.$/, "")).toFixed(2)}

      //Monthly
      if(pay == 0) {
        let pay_month_regex = /£([\d,\.]+) (gross a|\(gross\) a|a|per|per calendar|paid in) month/gi
        let pay_month_match = pay_month_regex.exec(line.text)
        if(pay_month_match) {pay = Number( pay_month_match[1].replace(",","").replace(/\.$/, "") ).toFixed(2) * 12}
      }
      //Quarterly
      if(pay == 0) {
        let pay_quarter_regex = /£([\d,\.]+)( gross a | \(gross\) a | a | per | paid per | paid in a | every | )(quarter)/gi
        let pay_quarter_match = pay_quarter_regex.exec(line.text)
        if(pay_quarter_match) {pay = Number(pay_quarter_match[1].replace(",","").replace(/\.$/, "")).toFixed(2) * 4}
      }
      //Fallback
      if(pay == 0) {
        let pay_regex = (/£([\d,\.]+)/gi)
        let pay_match = pay_regex.exec(line.text)
        if(pay_match) {pay = +Number(pay_match[1].replace(",","").replace(/\.$/, "")).toFixed(2)}
      }

      if (pay == NaN) {pay = 0}

      jobs.push({"text": line.text, "title": job_title, "info": job_info, "employer": employer, "pay": pay})
    }
    this.jobs = jobs
  }

  addAll(jobs) {
    this.jobs.forEach(job => this.add(job))
  }

  add(job) {
    let hash = md5(job.text)

    let sql = "INSERT IGNORE INTO jobs(mp_id, mp_name, text, job_title, job_info, pay, hash) VALUES(?,?,?,?,?,?,?)"
    let inserts = [this.id, this.name, job.text, job.title, job.info, job.pay, hash]
    sql = mysql.format(sql, inserts)
    pool.query(sql)
  }

}

module.exports = Jobs
