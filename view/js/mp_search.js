$( document ).ready(function() {
  let search_query = $( "select#mp_search_select" ).val();
  mp_search(search_query)
})

let mp_last_query = ""
function mp_search(value) {
  let query = value

  if(query != mp_last_query) {
    $("#mp_search_results").html("")

    var jqxhr = $.get( "/search/mp_search.php?query=" + query)
    .done(function(data) {
      data = JSON.parse(data)
      mpDisplaySearchResults(data, query)
    })
    .fail(function(e) {
      console.log(e)
    })
  }

  mp_last_query = query

}

function mpDisplaySearchResults(data, query) {

  let property_line = data[1].property[0].total ? "<p><b>" + data[1].property[0].total + "</b> declared property interests. Totaling <b>" + data[1].property[0].quantity + "</b> properties.</p>" : "<p><b>No </b> declared property interests.</p>"

  let shareholding_line = data[2].shares[0].total ? "<p><b>" + data[2].shares[0].total + "</b> declarations of sharholdings.</p>" : "<p><b>No </b> declared sharholdings.</p>"

  let jobs_line = data[3].jobs[0].pay ? "<p><b>£" + Number(data[3].jobs[0].pay).toLocaleString() + "</b> of additional income declared in the past year from <b>" + data[3].jobs[0].total + "</b> jobs</p>" : "<p><b>No</b> outside income declared.</p>"

  let donations_line = data[4].donations[0].amount ? "<p><b>£" + Number(data[4].donations[0].amount).toLocaleString() + "</b> of donations declared from <b>"+ data[4].donations[0].donors +"</b> donors</p>" : "<p><b>No</b> money received from donations</p>"

  $("#mp_search_results").append(
    "<div class='mp_card'>" +
      "<div class='card_content'>" +
        "<div class='card_head " + data[0].info[0].party + "'>" +
          "<p class='name'>" + data[0].info[0].first_name + " " + data[0].info[0].last_name + "</p>" +
          "<p class='party'>" + data[0].info[0].party + "</p>" +
        "</div>" +
        "<div class='card_body'>" +
          "<p class='centered'><b>" + data[0].info[0].constit + "</b></p>" +
          "<p onclick='full_search(" + query + ")' class='card_full_link'>" + "View all declarations" + "</p>" +
          property_line +
          shareholding_line +
          jobs_line +
          donations_line +
        "</div>" +
      "</div> " +
    "</div>"
  )

  if(data.length == 0) {
    $("#mp_search_results").html("")
  }

}

{/* <div class="container">
  <div class="row">

    <div class="col-md-6">
      <div class="mp_card card_center">
        <div class="card_content">
          <div class="card_head">
            <p class="name">Boris Johnson</p>
            <p class="party">Conservative</p>
          </div>
          <div class="card_body">
            <p class="centered"><b>MP for Uxbridge and Ruislip</b></p>
            <p><b>2</b> declared property interests.</p>
            <p><b>2</b> declarations of sharholdings.</p>
            <p><b>£363,000.00</b> of additional income declared in the past year from <b>3</b> jobs</p>
            <p><b>£64,000.34</b> of donations declared from <b>5</b> donors</p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
    </div>

  </div>
</div> */}
