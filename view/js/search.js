$( document ).ready(function() {


});

let last_query = ""
function search(value) {
  let query = value

  if(query.length > 2 && query != last_query) {
    $("#search_results").html("")

    var jqxhr = $.get( "http://mps-interests.local/search/search.php?query=" + query)
    .done(function(data) {
      data = JSON.parse(data)
      displaySearchResults(data, query)
    })
    .fail(function(e) {
      console.log(e)
    })
  }
  else if(query.length <= 2) {
    $("#search_results").html("")
    $("#search_info").html("<p>Found 0 results <b>(Query must be more than two characters)</b></p>")
  }

  last_query = query

}

function displaySearchResults(data, query) {

  regex = new RegExp("(" + query + ")", "gi");

  for(d of data) {
    $("#search_results").append(
      "<div class='search_result'>" +
        "<p>" + d.first_name + " " + d.last_name + " (" + d.party + ")</p>" +
        "<p class='search_result_section_title'>" + d.section + "</p>" +
        "<p>" + d.text.replace(regex, "<span class='highlight'>$1</span>") + "</p>" +
      "</div>"
    )
  }

  if(data.length == 0) {
    $("#search_results").html("")
  }

  $("#search_info").html("<p>Found " +  data.length + " results</p>")

}
