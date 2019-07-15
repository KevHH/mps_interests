(() => {
  small_pie("con_small_pie", "#00aadd", [301, 11])
  small_pie("lab_small_pie", "#dc241f", [215, 33])
  small_pie("snp_small_pie", "#d6d600", [30, 5])
  small_pie("lib_small_pie", "#fdbb30", [12])
  small_pie("ind_small_pie", "#CCC", [13,7])
  small_pie("dup_small_pie", "#d46a4c", [10])
  small_pie("plaid_small_pie", "#008142", [3,1])
  small_pie("green_small_pie", "#99cc33", [1])
})()

function small_pie(div_id, colour, data) {
  let width = document.getElementById(div_id).offsetWidth
  let height = 57;

  var pieGenerator = d3.pie()
  var arcData = pieGenerator(data)

  let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(25)
  .padAngle(.08)

  let svg = d3.select("#" + div_id)
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  svg.append("g")
  .attr("transform", "translate(" + width / 2 + "," + height/2 + ")")
  .selectAll('path')
  .data(arcData)
  .enter()
  .append('path')
  .attr('d', arcGenerator)
  .attr("fill", (d,i) => i == 0 ? colour : "#e0dfdf")
  .attr("stroke", "#000")
  .attr("stroke-width", "0.3")
  .attr("opacity", (d,i) => i == 0 ? 1 : 0.6)
}
