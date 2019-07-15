// This probably shouldn't be implemented in D3 and is just more unecessary JS. I was going to do this as a stacked bar chart, but then remembered Bootstrap had a nice progress bar class so just converted to that.

(() => {

  let data = [
    {"question": "Once they are elected, MPs should be full-time, professional politicians",
    "strongly agree": 30,
    "agree": 42.2,
    "neither disagree nor agree": 20.2,
    "disagree": 6.8,
    "strongly disagree": 0.9},
    {"question": "MPs need to stay in touch with ordinary people by being engaged in activities otherthan politics",
    "strongly agree": 20.9,
    "agree": 50.8,
    "neither disagree nor agree": 21.1,
    "disagree": 5.8,
    "strongly disagree": 0.9},
    {"question": "As long as my MP represents my constituency well I do not mind whether he or she has another job",
    "strongly agree": 4.7,
    "agree": 26.7,
    "neither disagree nor agree": 23.9,
    "disagree": 30.9,
    "strongly disagree": 13.8},
    {"question": "MPs should only have second jobs that were declared to the public at the time of their election",
    "strongly agree": 29.9,
    "agree": 48.9,
    "neither disagree nor agree": 13.9,
    "disagree": 5.3,
    "strongly disagree": 2.1},
    {"question": "It would be a source of concern if my MP was making more money from his or her second job than from their MP salary",
    "strongly agree": 37.3,
    "agree": 36.2,
    "neither disagree nor agree": 17.4,
    "disagree": 7.7,
    "strongly disagree": 1.5}]

    let margin = {top: 20, right: 20, bottom: 20, left: 20}
    let width = 400 + margin.left + margin.right

    let body = d3.select("#study_lines")
    .style("width", width + "px")
    .style("margin-right", "30px")
    .append("div")

    let bar_div = body.selectAll("div")
    .data(data)
    .enter()
    .append("p")
    .append("b")
    .html(d => d.question)

    let lines = bar_div.append("div")
    .attr("class", "progress")
    .style("margin-top", "20px")
    .style("margin-bottom", "20px")
    .style("height", "30px")

    lines.each( function(d,i) {
      let line = d3.select(this)

      line.append("div")
      .attr("class", "progress-bar " + "strong_agree")
      .style("width", d["strongly agree"] + "%")
      .html( d["strongly agree"] > 10 ? d["strongly agree"] + "%" : "" )

      line.append("div")
      .attr("class", "progress-bar " + "agree")
      .style("width", d["agree"] + "%")
      .html( d["agree"] > 10 ? d["agree"] + "%" : "" )

      line.append("div")
      .attr("class", "progress-bar " + "neither")
      .style("width", d["neither disagree nor agree"] + "%")
      .html( d["neither disagree nor agree"] > 10 ? d["neither disagree nor agree"] + "%" : "" )

      line.append("div")
      .attr("class", "progress-bar " + "disagree")
      .style("width", d["disagree"] + "%")
      .html( d["disagree"] > 10 ? d["disagree"] + "%" : "" )

      line.append("div")
      .attr("class", "progress-bar " + "strong_disagree")
      .style("width", d["strongly disagree"] + "%")
      .html( d["strongly disagree"] > 10 ? d["strongly disagree"] + "%" : "" )

    })

  })()
