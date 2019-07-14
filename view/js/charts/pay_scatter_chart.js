(() => {

  let svg = d3.select("#pay_swarm_chart")
  .append("svg")
  .attr("width", $("#pay_swarm_chart").width())
  .attr("height", 400)

  let margin = {top: 40, right: 10, bottom: 40, left: 10}
  let width = svg.attr("width") - margin.left - margin.right
  let height = svg.attr("height") - margin.top - margin.bottom

  let circle_size = width / 100;

  let formatValue = d3.format(",d")

  let x = d3.scaleLog().range([ margin.left, width])

  let g = svg.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  d3.json("js/charts/data/mp_pay.json", function(error, data) {
    if (error) throw error;

    x.domain(d3.extent(data, d => Math.ceil(d.value) ))

    let simulation = d3.forceSimulation(data)
    .force("x", d3.forceX(d => x(+d.value)).strength(10))
    .force("y", d3.forceY((height / 2)).strength(1))
    .force("collide", d3.forceCollide(circle_size + 1))
    .stop()

    for (let i = 0; i < data.length; ++i) simulation.tick()

    let mp_circles = svg.selectAll(".mp_circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "mp_circle")
    .attr("cx", d => d.x + margin.left)
    .attr("cy", d => d.y)
    .attr("r", circle_size)
    .attr("class", (d) => d.party )

    let tooltip = d3.select("#pay_swarm_chart")
    .append("div")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .attr("class", "tooltip")
    .html("test")

    mp_circles.on("mouseover", function(d){
      tooltip.attr("class", "tooltip")

      d3.select(this).transition()
      .duration(0)
      .style("opacity", 1)

      tooltip.attr("class", "tooltip " + d.party)
      .style("background-color", "#FFF")
      .style("display", "block")
      .transition()
      .duration(100)
      .style("opacity", 1)
      tooltip.html("<p><b>" + d.id + "</b></p>" + "<p><span class='badge " + d.party + "'>" + d.party + "</span></p>" + "<p><b>£" + d.value.toLocaleString() + "</b> estimated annual income</p>")

      let tooltip_x = +d3.select(this).attr("cx")
      let tooltip_y = +d3.select(this).attr("cy")

      tooltip.style("left", (tooltip_x) + 50 + "px")
      .style("top", (tooltip_y) + "px")

    })

    mp_circles.on("mouseout", (d) => {
      tooltip.style("display", "none")

    })

    g.append("g")
    .attr("class", "axis axis-x")
    .attr("transform", "translate(0," + height + ")")
    .attr("opacity", "0.5")
    .call(d3.axisBottom(x)
    .ticks(18, ".0s"))

    //Grid Lines
    g.append("line")
    .attr("x1", x(12000) )
    .attr("y1", 0)
    .attr("x2", x(12000))
    .attr("y2", height)
    .attr("stroke", "#777")
    .attr("stroke-width", "1px")
    .attr("stroke-dasharray", "5,5")

    g.append("line")
    .attr("x1", x(36000) )
    .attr("y1", 0)
    .attr("x2", x(36000))
    .attr("y2", height)
    .attr("stroke", "#777")
    .attr("stroke-width", "1px")
    .attr("stroke-dasharray", "5,5")

    g.append("line")
    .attr("x1", x(79000) )
    .attr("y1", 0)
    .attr("x2", x(79000))
    .attr("y2", height)
    .attr("stroke", "#777")
    .attr("stroke-width", "1px")
    .attr("stroke-dasharray", "5,5")

    // setInterval(function(){
    //
    //   simulation.tick()
    //   mp_circles.transition()
    //   .duration(50)
    //   .attr("cx", d => d.x + margin.left)
    //   .attr("cy", d => d.y)
    //
    // }, 50);

  })

})()
