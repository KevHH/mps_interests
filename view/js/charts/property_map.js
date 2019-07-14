(() => {

  let width = $("#property_map").width()
  let height = 500;

  let svg = d3.select("#property_map")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(0,0)")

  let tooltip = d3.select("#property_map")
  .append("div")
  .attr("class", "tooltip")
  .attr("transform", "translate(0,0)")

  let map = svg.append("g")

  let uk_projection = d3.geoMercator()
  .scale(1800)
  .center([-3.1278, 54.5])
  .translate([width / 2, height / 2])

  let uk_path = d3.geoPath().projection(uk_projection)
  let url = "https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson"

  d3.json(url, function(err, geojson) {
    map.append("path")
    .attr("d", uk_path(geojson))
    .attr("fill", "#FFF")
    .attr("opacity", "0.3")
    .attr("stroke", "#000")
    .attr("stroke-width", "1.2")

    d3.json("js/charts/data/properties.json", function(err, data) {
      let points = map.selectAll("circle")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "point")

      let circles = points.append("circle")

      circles.attr("cx", function(d) { return d.lon != "null" ? uk_projection([d.lon,d.lat])[0] : 0 })
      .attr("cy", function(d) { return d.lat != "null" ? uk_projection([d.lon,d.lat])[1] : 0 })
      .attr("r", d => d.quantity < 5 ? d.quantity : 10)
      .style("fill", "#55929b")
      .style("stroke", "#777777")

      points.append("text")
      .attr("x", d => d.quantity < 9 ? (uk_projection([d.lon,d.lat])[0]) - 5 : (uk_projection([d.lon,d.lat])[0]) - 8 )
      .attr("y", d => d.lat != "null" ? (uk_projection([d.lon,d.lat])[1]) + 5 : 0 )
      .text(d => d.quantity >= 5 ? d.quantity : "")
      .attr("fill", "#FFF")
      .attr("font-size", "14px")
      .style("cursor", "default")

      points.on("mouseover", (d) => {
        tooltip.style("opacity", 1)
        .style("display", "block")
        .style("left", uk_projection([d.lon,d.lat])[0] + "px")
        .style("top", uk_projection([d.lon,d.lat])[1] + "px")
        .style("cursor", "default")
        .html("<p>" + d.place + "</p><p>" + d.quantity + "</p>")
      })

      points.on("mouseout", (d) => {
        tooltip.style("opacity", 0)
        .style("display", "none")
        .style("left", "0px" )
        .style("top", "0px" )
        .html("")
      })

    })

  })

})()
