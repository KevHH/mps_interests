function full_search(value) {
  let query = value

  $("#mp_search_results").html("")

  var jqxhr = $.get( "/search/full.php?query=" + query)
  .done(function(data) {
    data = JSON.parse(data)
    displayFullSearchResults(data, query)
  })
  .fail(function(e) {
    console.log(e)
  })

}

function displayFullSearchResults(data, query) {

  let holder = $("<div>", {"class": "full_text_result search_result " + data[0].party})

  $("#mp_search_results").append(holder)
  holder.append(
    "<p class='search_result_name'>Showing all results for:</p>" +
    "<p><span onclick='mp_search(" + data[0].id + ")' class='search_result_name'>" + data[0].first_name + " " + data[0].last_name + "</span> <span class='badge " + data[0].party + "'>" + data[0].party + "</span></p>"
  )

  let section = ""
  for(d of data) {
    if(d.section != section) {
      section = d.section
      holder.append(
        "<p><b>" + d.section + "</b></p>"
      )
    }

    holder.append(
      "<p>" + d.text + "</p>"
    )
  }

  // regex = new RegExp("(" + query + ")", "gi");
  //
  // for(d of data) {
  //   $("#search_results").append(
  //     "<div class='search_result " + d.party + "'>" +
  //     "<p><span onclick='mp_search(" + d.id + ")' class='search_result_name'>" + d.first_name + " " + d.last_name + "</span> <span class='badge " + d.party + "'>" + d.party + "</span></p>" +
  //     "<p class='search_result_section_title'>" + d.section + "</p>" +
  //     "<p>" + d.text.replace(regex, "<span class='highlight'>$1</span>") + "</p>" +
  //     "</div>"
  //   )
  // }
  //
  // if(data.length == 0) {
  //   $("#search_results").html("")
  // }
  //
  // $("#search_info").html("<p>Found " +  data.length + " results</p>")

}
