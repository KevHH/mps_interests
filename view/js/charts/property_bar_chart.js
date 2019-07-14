(() => {

  let by_total = d3.select("#property_bar_chart")
  .append("div")
  .attr("class", "bar_chart_btn active")
  .html("By total MPs per party")
  .on("click", update_property_chart_total)

  let by_perc = d3.select("#property_bar_chart")
  .append("div")
  .attr("class", "bar_chart_btn")
  .html("By percentage of MPs per party")
  .on("click", update_property_chart_perc)
  .style("margin-bottom", "20px")

  let svg = d3.select("#property_bar_chart")
  .append("svg")
  .attr("width", $("#property_bar_chart").width())
  .attr("height", 300)

  let g = svg.append("g")

  let margin = {top: 40, right: 20, bottom: 0, left: 20}
  let padding = 0
  let width = svg.attr("width") - margin.left - margin.right
  let height = svg.attr("height") - margin.top - margin.bottom

  let data = [
    {"party": "Conservative", "total": 85, "perc": 27},
    {"party": "Labour", "total": 25, "perc": 10},
    {"party": "Liberal", "total": 3, "perc": 25},
    {"party": "SNP", "total": 2, "perc": 6},
    {"party": "DUP", "total": 1, "perc": 10}
  ]

  //X axis
  let x = d3.scaleBand()
  .range([0, width])
  .padding(0.2)
  x.domain(data.map(d => d.party ))

  //Y axis
  let y = d3.scaleLinear()
  .range([(height)-padding, 0])
  y.domain([0, d3.max(data, d => d.total ) * 1.1])

  let x_axis = svg.append("g")
  .attr("transform", "translate(0," + (height) + ")")
  .call(d3.axisBottom(x))

  // let y_axis = svg.append("g")
  // .attr("transform", "translate(" + margin.left + "," + 0 + ")")
  // .call(d3.axisLeft(y))

  let bars = svg.selectAll(".property_bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", d => "property_bar " + d.party)
  .attr("x", d => x(d.party))
  .attr("width", x.bandwidth())
  .attr("y", d => y(d.total) )
  .attr("height", d => (height) - y(d.total) )

  let bar_labels = svg.selectAll(".property_bar_labels")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "property_bar_labels")
  .text(d => d.total > 1 ? d.total + " MPs" : d.total + "MP")
  .attr("x", d => x(d.party) + (x.bandwidth()/2))
  .attr("y", d => y(d.total) - 5 )
  .attr("width", x.bandwidth())
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .style("fill", "#777")

  function update_property_chart_total() {
    y.domain([0, d3.max(data, d => d.total ) * 1.1])
    // y_axis.call(d3.axisLeft(y))

    by_total.attr("class", "bar_chart_btn active")
    by_perc.attr("class", "bar_chart_btn")

    bars.transition()
    .duration(500)
    .attr("y", d => y(d.total) )
    .attr("height", d => (height-padding) - y(d.total))

    bar_labels.transition()
    .duration(500)
    .attr("y", d => y(d.total) - 5 )
    .text(d => d.total > 1 ? d.total + " MPs" : d.total + "MP")
  }

  function update_property_chart_perc() {
    y.domain([0, d3.max(data, d => d.perc * 1.1 )])
    // y_axis.call(d3.axisLeft(y))

    by_total.attr("class", "bar_chart_btn")
    by_perc.attr("class", "bar_chart_btn active")

    bars.transition()
    .duration(500)
    .attr("y", d => y(d.perc) )
    .attr("height", d => (height-padding) - y(d.perc))

    bar_labels.transition()
    .duration(500)
    .attr("y", d => y(d.perc) - 5 )
    .text(d => d.perc + "%")
  }

})()
