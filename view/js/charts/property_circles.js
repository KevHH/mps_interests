create_circles("#property_shares_chart", "js/charts/data/property_shares.csv", 2)
create_circles("#property_jobs_chart", "js/charts/data/property_jobs.csv", 1)
create_circles("#property_donations_chart", "js/charts/data/property_donations.csv", 1)

function create_circles(div_id, csv_url, rows) {

  let circle_size = 40
  let circle_margin = 30

  d3.csv(csv_url, function(err, data) {

    let sorted_data = d3.nest()
    .key(function(d) { return d.first_name + d.last_name })
    .entries(data)

    let width = $(div_id).width()
    let height = 45 * rows
    let margin = {top: 20, right: 20, bottom: 20, left: 10}
    let svg = d3.select(div_id)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

    let tooltip = d3.select(div_id)
    .append("div")
    .attr("class", "tooltip")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    let g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    // Hack (I can't be bothered to properly do the maths for this, so just looping it)
    let col = -1
    let row = 0
    sorted_data.forEach( (data) => {

      let circle = g.append("circle")
      .attr("cx", () => {
        col++
        if(col * circle_size > (width-circle_size)-10) {row++; col = 0;}
        return (col * circle_size) + 10
      })
      .attr("cy", row * circle_size)
      .attr("r", 15)
      .attr("class", data.values[0].party)

      let companies = ""
      data.values.forEach( (d)=> companies += ("<p> - " + d.company + "</p>"))

      circle.on("mouseover", () => {
        tooltip.style("opacity", 1)
        .attr("class", "tooltip " + data.values[0].party)
        .style("left", +circle.attr("cx") + circle_size + "px" )
        .style("top", circle.attr("cy") + "px" )
        .style("background-color", "#FFF")
        .html(
          "<p><b>" + data.values[0].first_name + data.values[0].last_name + " MP </b> " +
          "<span class='badge " + data.values[0].party + "'>" + data.values[0].party+ "</span>" +
          "<p>" + companies + "</p>"
        )
      })
      circle.on("mouseout", () => {
        tooltip.style("opacity", 0)
        .style("left", "0px" )
        .style("top", "0px" )
        .html("")
      })

    })

  })
}
