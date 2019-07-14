(() => {

  let svg = d3.select("#pay_range_chart")
  .append("svg")
  .attr("width", $("#pay_range_chart").width())
  .attr("height", 400)

  let g = svg.append("g")

  let margin = {top: 70, right: 20, bottom: 40, left: 20}
  let range_margin = 80
  let width = svg.attr("width") - margin.left - margin.right
  let height = svg.attr("height") - margin.top - margin.bottom

  let data = [
    {"party": "Conservative", "min": 125, "max": 734233.29, "avg": 8353.845},
    {"party": "Labour", "min": 150, "max": 25254, "avg": 1320.005},
    {"party": "Liberal", "min": 2804.66, "max": 83476.28, "avg": 42150},
    {"party": "Scottish", "min": 150, "max": 50316, "avg": 1090}
  ]

  let x = d3.scaleLog()
  .range([ margin.left, width])
  .domain([100, 800000])

  g.append("g")
  .attr("class", "axis axis-x")
  .attr("transform", "translate(0," + (height + margin.top) + ")")
  .attr("opacity", "0.5")
  .call(d3.axisBottom(x)
  .ticks(10, ".0s"))

  let ranges = svg.selectAll(".pay_range")
  .data(data)
  .enter()

  //Min
  ranges.append("circle")
  .attr("class", d => d.party)
  .attr("cx", d => x(d.min))
  .attr("cy", (d,i) => margin.top + (i * range_margin))
  .attr("r", 10)
  .attr("fill", "#000")
  ranges.append("text")
  .attr("class", d => d.party)
  .attr("x", d => x(d.min))
  .attr("y", (d,i) => margin.top + (i * range_margin) - 15)
  .text(d => "£" + d.min)
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("text-anchor", "middle")

  // Max
  ranges.append("circle")
  .attr("class", d => d.party)
  .attr("cx", d => x(d.max))
  .attr("cy", (d,i) => margin.top + (i * range_margin))
  .attr("r", 10)
  .attr("fill", "#000")
  ranges.append("text")
  .attr("class", d => d.party)
  .attr("x", d => x(d.max))
  .attr("y", (d,i) => margin.top + (i * range_margin) - 15)
  .text(d => "£" + d3.format(".3s")(d.max))
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("text-anchor", "middle")

  // Line
  ranges.append("line")
  .attr("class", d => d.party)
  .attr("x1", d => x(d.min))
  .attr("y1", (d,i) => margin.top + (i * range_margin))
  .attr("x2", d => x(d.max))
  .attr("y2", (d,i) => margin.top + (i * range_margin))
  .attr("stroke-width", "5px")
  .attr("stroke", "#000")

  // Median
  ranges.append("circle")
  .attr("class", d => d.party)
  .attr("cx", d => x(d.avg))
  .attr("cy", (d,i) => margin.top + (i * range_margin))
  .attr("r", 5)
  .attr("fill", "#000")
  ranges.append("text")
  .attr("class", d => d.party)
  .attr("x", d => x(d.avg))
  .attr("y", (d,i) => margin.top + (i * range_margin) + 20)
  .text(d => "£" + d3.format(".3s")(d.avg))
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("text-anchor", "middle")

  //Title low
  svg.append("text")
  .attr("x", x(125))
  .attr("y", 37)
  .text("Lowest")
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("fill", "#777")
  .style("text-anchor", "middle")
  .style("font-size", "15px")

  //Title high
  svg.append("text")
  .attr("x", x(734000))
  .attr("y", 37)
  .text("Highest")
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("fill", "#777")
  .style("text-anchor", "middle")
  .style("font-size", "15px")

  //Median
  svg.append("text")
  .attr("x", x(8350))
  .attr("y", 60)
  .text("Median")
  .attr("stroke-width", "0px")
  .attr("font-weight", "bold")
  .style("fill", "#777")
  .style("text-anchor", "middle")
  .style("font-size", "15px")

  //Total median line
  // g.append("line")
  // .attr("x1", x(2462.5))
  // .attr("y1", (margin.top/2) )
  // .attr("x2", x(2462.5))
  // .attr("y2", height + margin.top)
  // .attr("stroke", "#777")
  // .attr("stroke-width", "1px")
  // .attr("stroke-dasharray", "5,5")

})()
