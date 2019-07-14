// There's probably a better way to do all this rather than layering the shapes, but it does follow some sort of logic...
(() => {

  let width = document.getElementById("total_interests_pie_chart").offsetWidth
  height = document.getElementById("total_interests_stats").offsetHeight
  margin = 0

  let svg = d3.select("#total_interests_pie_chart")
  // .attr("style", "background-color: #FFF")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height/2 + ")")

  let data = {a: 587, b: 63}
  let colours = {a: "#55929B", b: "#696463"}
  let trans = {a: "1", b: "0.2"}

  let party_data = {a: 30, b: 63, c: 100, d: 40}

  // Compute the position of each group on the pie:
  let pie = d3.pie()
  .value(function(d) {return d.value; })
  let data_ready = pie(d3.entries(data))

  // shape helper to build arcs:
  let arcGenerator = d3.arc()
  .innerRadius(width/3.2)
  .outerRadius(2)
  .padAngle(.04)
  .padRadius(100)
  .cornerRadius(0)

  let arcLabelGenerator = d3.arc()
  .innerRadius(width/3.05)
  .outerRadius(height/16)
  .padAngle(0.05)
  .padRadius(100)
  .cornerRadius(0.2)

  // Complete hack (magic num is 90 degree in radians)
  svg.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", d => 0 + (width/2.6) * Math.cos(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("y2", d => 0 + (width/2.6) * Math.sin(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("stroke", "#AAA")
  .style("stroke-width", "2px")

  svg.append("line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0 + (width/2.6) * -Math.cos(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("y2", 0 + (width/2.6) * -Math.sin(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("stroke", "#AAA")
  .style("stroke-width", "2px")

  svg.append("text")
  .attr("font-size", "11px")
  .text("MPs not declaring any outside interests")
  .attr("x", 0 + (width/2.4) * Math.cos(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) - 75 )
  .attr("y", 0 + (width/2.4) * Math.sin(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("fill", "#777")

  svg.append("text")
  .attr("font-size", "11px")
  .text("MPs declaring outside interests")
  .attr("x", 0 + (width/2.4) * -Math.cos(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) - 90 )
  .attr("y", 0 + (width/2.2) * -Math.sin(data_ready[1].startAngle + ((data_ready[1].endAngle - data_ready[1].startAngle)/2) - 1.5708) )
  .attr("fill", "#777")

  //Outer ring of labels
  // svg.selectAll('outerLabel')
  // .data(data_ready)
  // .enter()
  // .append('path')
  // .attr("id", (d,i) => "label_" + i)
  // .attr('d', arcLabelGenerator)
  // .attr("fill", "#FFF")
  // .attr("stroke", "#AAA")
  // .style("stroke-width", "2px")
  // .style("opacity", 1)

  svg.append('circle')
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", width/3.12)
  .attr("fill", "white")

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  let pie_chart = svg.selectAll('slice')
  .data(data_ready)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr('fill', d => colours[d.data.key])
  .attr("stroke", "#000")
  .style("stroke-width", "1px")
  .style("opacity", d => trans[d.data.key])

  // Now add the annotation. Use the centroid method to get the best coordinates
  svg.selectAll('slices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(d => d.value)
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)

})()
