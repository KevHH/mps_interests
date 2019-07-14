// This is elaborately flashy for no practical reason.

(() => {

  let width = $("#visits_map").width()
  let height = 500
  const sensitivity = 75

  let tooltip = d3.select("#visits_map")
  .append("div")
  .attr("class", "tooltip")

  let projection = d3.geoOrthographic()
  .scale(250)
  .center([0, 0])
  .rotate([0,-30])
  .translate([width / 2, height / 2])

  const initialScale = projection.scale()
  let path = d3.geoPath().projection(projection)

  let svg = d3.select("#visits_map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  let globe = svg.append("circle")
  .attr("fill", "#EEE")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.2")
  .attr("cx", width/2)
  .attr("cy", height/2)
  .attr("r", initialScale)

  svg.call(d3.drag().on('drag', () => {
    const rotate = projection.rotate()
    const k = sensitivity / projection.scale()
    projection.rotate([
      rotate[0] + d3.event.dx * k,
      rotate[1] - d3.event.dy * k
    ])
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
    //console.log(projection.rotate())
    //console.log(projection.scale())
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn")
  }))
  .call(d3.zoom().on('zoom', () => {
    projection.scale(initialScale * d3.event.transform.k)
    path = d3.geoPath().projection(projection)
    svg.selectAll("path").attr("d", path)
    globe.attr("r", projection.scale())
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn")
  }))

  let map = svg.append("g")

  d3.json("js/charts/data/world_map.json", function(err, d) {

    countries = []

    map.append("g")
    .attr("class", "countries" )
    .selectAll("path")
    .data(d.features)
    .enter().append("path")
    .attr("class", d => "country_" + d.properties.name.replace(" ","_"))
    .attr("d", path)
    .attr("fill", "white")
    .style('stroke', 'black')
    .style('stroke-width', 0.3)
    .style("opacity",0.8)

    d3.csv("js/charts/data/visits.csv", function(err, data) {

      let colour_scale = d3.scaleQuantize()
      .domain([1, 49])
      .range(["#c6dbef", "#9ecae1", "#6baed6", "#3182bd", "#08519c"])

      svg.append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(20,20)");

      let legend = d3.legendColor()
      .labelFormat(d3.format(".0f"))
      // .useClass(true)
      .title("No. of visits:")
      .titleWidth(100)
      // .shapeWidth(50)
      // .orient('horizontal')
      .scale(colour_scale);

      svg.select(".legendQuant")
      .call(legend);

      data.forEach( (d) => {
        let country = d.country
        let total = d.total
        map.select(".country_" + country.replace(" ", "_"))
        .attr("fill", d => {return colour_scale(total)})
        .on('mouseover',function(d){
          if(total > 0) {
            let coords = d3.mouse(this)

            tooltip.style("width", "100px")
            .html(country + " - " + total)
            .style("opacity", "0.7")
            .style("left", +coords[0] - 50 + "px")
            .style("top", +coords[1] + 50 + "px")
            .style("display", "block")
          }
        })
        .on('mouseout', function(d){
          tooltip.style("opacity", "0")
          .style("width", "0px")
          .html("")
          .style("display", "none")
        })
      })

    })

  })

  // Not DRY but I'm not refactoring this
  d3.select("#visits_map_europe")
  .on("click", () => {
    rotate_globe([-4.693162104782414, -52.57525762726198], 680)
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn active")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn")
  })
  d3.select("#visits_map_middle_east")
  .on("click", () => {
    rotate_globe([-42.769203247847585, -29.304579171981477], 680)
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn active")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn")
  })
  d3.select("#visits_map_east_asia")
  .on("click", () => {
    rotate_globe([-94.36957768167792, -26.39271556885874], 410)
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn active")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn")
  })
  d3.select("#visits_map_americas")
  .on("click", () => {
    rotate_globe([-275.8771365288019, -22.417429454703175], 410)
    d3.select("#visits_map_europe").attr("class", "bar_chart_btn")
    d3.select("#visits_map_middle_east").attr("class", "bar_chart_btn")
    d3.select("#visits_map_east_asia").attr("class", "bar_chart_btn")
    d3.select("#visits_map_americas").attr("class", "bar_chart_btn active")
  })

  function rotate_globe(r_dest, s_dest) {
    d3.transition()
    .duration(1000)
    .tween("rotate", function() {
      let r = d3.interpolate(projection.rotate(), r_dest)
      var s = d3.interpolate(projection.scale(), s_dest)
      return function(t) {
        projection.rotate(r(t))
        projection.scale(s(t))
        globe.attr("r", (s(t)))
        svg.selectAll("path").attr("d", path)
      }
    })
  }

  // setInterval(function(){
  //   const rotate = projection.rotate()
  //   const k = sensitivity / projection.scale()
  //   projection.rotate([
  //     rotate[0] - 1 * k,
  //     rotate[1]
  //   ])
  //   path = d3.geoPath().projection(projection)
  //   svg.selectAll("path").attr("d", path)
  // }, 20)

})()
