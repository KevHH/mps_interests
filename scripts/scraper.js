const fetch = require("node-fetch")
const cheerio = require('cheerio')
const _ = require('lodash')

const Mp = require('./Mp')

const Text = require('./Text')

const Properties = require('./Properties')
const Jobs = require('./Jobs')
const Shares = require('./Shares')
const Donations = require('./Donations')
const Visits = require('./Visits')

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

function createSections(name, id, lines) {
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

  text = new Text(id, name)
  text.addAll(section_lines)

  if(sections["1. Employment and earnings"]) {
    lines = sections["1. Employment and earnings"]
    let jobs = new Jobs(name, id)
    jobs.parse(lines)
    jobs.addAll()
  }
  if(sections["2. (a) Support linked to an MP but received by a local party organisation or indirectly via a central party organisation"]) {
    lines = sections["2. (a) Support linked to an MP but received by a local party organisation or indirectly via a central party organisation"]
    let donations = new Donations(name, id)
    donations.parse(lines)
    donations.addAll()
  }
  if(sections["2. (b) Any other support not included in Category 2(a)"]) {
    lines = sections["2. (b) Any other support not included in Category 2(a)"]
    let donations = new Donations(name, id)
    donations.parse(lines)
    donations.addAll()
  }
  if(sections["4. Visits outside the UK"]) {
    lines = sections["4. Visits outside the UK"]
    let visits = new Visits(name, id)
    visits.parse(lines)
    visits.addAll()
  }
  if(sections["6. Land and property portfolio: (i) value over £100,000 and/or (ii) giving rental income of over £10,000 a year"]) {
    lines = sections["6. Land and property portfolio: (i) value over £100,000 and/or (ii) giving rental income of over £10,000 a year"]
    let properties = new Properties(name, id)
    properties.parse(lines)
    properties.addAll()
  }
  if(sections["7. (i) Shareholdings: over 15% of issued share capital"]) {
    lines = sections["7. (i) Shareholdings: over 15% of issued share capital"]
    let shares = new Shares(name, id)
    shares.parse(lines)
    shares.addAll()
  }
  if(sections["7. (ii) Other shareholdings, valued at more than £70,000"]) {
    lines = sections["7. (ii) Other shareholdings, valued at more than £70,000"]
    let shares = new Shares(name, id, true)
    shares.parse(lines)
    shares.addAll()
  }

}

(async function() {
  const contents_html = await getHTML("https://publications.parliament.uk/pa/cm/cmregmem/"+ date_code +"/contents.htm")
  const $ = cheerio.load(contents_html)

  const mps = getLinks($)

  for(mp of mps) {
    console.log("-------------------------------------")
    console.log(mp.name)

    let mp_obj = new Mp(mp.name)
    let id = await mp_obj.add()

    let mp_html = await getHTML("https://publications.parliament.uk/pa/cm/cmregmem/" + date_code + "/" + mp.link)
    const $ = cheerio.load(mp_html)
    let lines = []

    $('#mainTextBlock').find('p').each(function() {
      $(this).find("br").replaceWith( " | " )
      if($(this).text() != "\n") {lines.push( {"name": mp.name, "text": $(this).text(), "class": $(this).attr("class")} )}
    })

    lines.shift() // The first line is always the name of the MP so if can be removed
    createSections(mp.name, id, lines)
  }

}())
