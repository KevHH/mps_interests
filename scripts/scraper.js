require('dotenv').config()

const fetch = require("node-fetch")
const util = require('util')
const cheerio = require('cheerio')
const wordsToNumbers = require('words-to-numbers')
const _ = require('lodash');

// let mysql = require('mysql')
// let pool  = mysql.createPool({
//   connectionLimit : 100,
//   host            : process.env.DB_HOST,
//   user            : process.env.DB_USER,
//   password        : process.env.DB_PASS,
//   database        : process.env.DB_DATABASE,
// })
// pool.query = util.promisify(pool.query)

const date_code = 190603

async function getHTML(url) {
  const response = await fetch(url)
  return  response.text()
}

function getLinks($) {
  links = []
  $('#mainTextBlock').find('a').each(function() {
    if( $(this).attr('href') != undefined && !/#[A-Z]/.test($(this).attr('href')) ) {
      links.push({"name": $(this).text() ,"link": $(this).attr('href')})
    }
  })
  return links
}

function createSections(lines) {
  let section_title = ""
  section_lines = []

  for(line of lines) {
    if(/^\d+\./.test(line.text)) {section_title = line.text}
    if(section_title != "" && section_title != line) {
      line.section = section_title
      section_lines.push(line)
    }
  }

  let sections = _.mapValues(_.groupBy(section_lines, 'section'))

  if(sections["1. Employment and earnings"]) {
    addEmployment(sections["1. Employment and earnings"])
  }
  else if(sections["6. Land and property portfolio: (i) value over £100,000 and/or (ii) giving rental income of over £10,000 a year"]) {
    for(line of sections["6. Land and property portfolio: (i) value over £100,000 and/or (ii) giving rental income of over £10,000 a year"]) {
      //addProperty(line.text)
    }
  }

}

function addEmployment(lines) {
  lines.shift()
  let jobs = []
  let job_title = null
  let pay_info = []

  for(line of lines) {
    if(line.class == "indent") {
      if(job_title != null) { jobs.push({"title": job_title, "pay_info": pay_info}) }
      job_title = line.text
      pay_info = []
    }
    else if(line.class == "indent2") {
      pay_info.push(line.text)
    }
  }
  if(job_title != null) { jobs.push({"title": job_title, "pay_info": pay_info}) }

  console.log(jobs)

}

function addProperty(line) {
  let count = 1
  let rented = false
  let holiday = false
  let house = false
  let flat = false
  let farm = false
  let residential = false
  let commercial = false
  let location = null

  if(line.match("(ii)")) {rented = true}
  if(line.match(/holiday/gi)) {holiday = true}
  if(line.match(/\bhouse\b|cottage/gi)) {house = true}
  if(line.match(/\bflat\b|apartment/gi)) {flat = true}
  if(line.match(/\bfarm\b/gi)) {farm = true}
  if(line.match(/residential/gi)) {residential = true}
  if(line.match(/commercial|\bshop\b/gi)) {commercial = true}
  if(line.match(/\bshared\b|\bshare\b/gi)) {shared = true}

  count_match = line.match(/four|eight|(?:fiv|(?:ni|o)n)e|t(?:wo|hree)|s(?:ix|even)/gi)
  count_match ? count = wordsToNumbers.wordsToNumbers(count_match[0]) : 1

  location_regex = (/(in|near) (\w\w+)/gi)
  location_match = location_regex.exec(line)
  location_match ? location = location_match[2] : "null"

  data = {"line": line, "count": count, "location": location, "rented": rented, "holiday": holiday, "house": house, "flat": flat, "farm": farm, "residential": residential, "commercial": commercial}

  console.log(data)
}

(async function() {
  const contents_html = await getHTML("https://publications.parliament.uk/pa/cm/cmregmem/"+ date_code +"/contents.htm")
  const $ = cheerio.load(contents_html)

  const mps = getLinks($)

  let i = 0
  for(mp of mps) {
    console.log("-------------------------------------")
    console.log(mp.name)

    let mp_html = await getHTML("https://publications.parliament.uk/pa/cm/cmregmem/" + date_code + "/" + mp.link)
    const $ = cheerio.load(mp_html)
    let lines = []

    $('#mainTextBlock').find('p').each(function() {
      $(this).find("br").replaceWith( " | " )
      if($(this).text() != "\n") {lines.push( {"name": mp.name, "text": $(this).text(), "class": $(this).attr("class")} )}
    })

    lines.shift() // The first line is always the name of the MP so if can be removed
    createSections(lines)

    // i++
    // if(i==100) {process.exit()}
  }

}())
