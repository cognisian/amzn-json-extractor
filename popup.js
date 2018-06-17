// Wait till the UI loads to retrieve book data
$(document).ready(function() {

  // Query the background page for the book
  chrome.runtime.sendMessage({type: 'query_book'}, function(resp) {

    // Format the JSON to pretty print
    var contents = JSON.stringify(resp.book, null, 2);

    // Get book display area
    var book_json_el = $('#book-json');
    $(book_json_el).append(contents);

    return true;
  });

  // Initialize the Chosen multiselect dropdown
  var select = $(".chosen-select")
  select.each(function(i,e) {

    var elem_id  = "#" + $(e).attr("id");
    var chosen = $(elem_id).chosen(
      { no_results_text: "<b>Press ENTER</b> to add new entry:" }
    );

    // Update the boko with selected values
    $(elem_id).chosen().on('change', function(ev, params) {
      var id = $(this).attr("id");
      var value = $(this).val();
      chrome.runtime.sendMessage({type: 'add_detail', term: id, obj: value});
    });

    // Allow adding new values
    var search_field = chosen.data("chosen").search_field;
    $(search_field).on("keyup", function(evt) {

      // Get the ID of Chosen elem (<Select>) and build an ID to
      // reference the container Chosen uses to replace <select>
      var parent_con = chosen.siblings("#" + chosen.attr("id") + "_chosen");

      // If user hits ENTER and No Results showing then insert new term
      if (evt.which === 13 && parent_con.find("li.no-results").length > 0) {

        // Insert the new option to the multiselect control
        var option = $("<option>").val(this.value).text(this.value);
        chosen.prepend(option);
        chosen.find(option).prop("selected", true);

        // Trigger the update to refresh list of options
        chosen.trigger("chosen:updated");
      }
    });
  });

  // Hook button up so it will download the json
  $('a#download-json').on('click', function(e) {

    // Query the background page for the book
    chrome.runtime.sendMessage({type: 'query_book'}, function(resp) {

      // Format the JSON to pretty print
      var contents = JSON.stringify(resp.book, null, 2);

      // Build string for downloaded file name
      var isbn = resp.book.isbn;
      var title = resp.book.title.replace(/ /g, '_')
      var download_file = isbn + '_' + title + '.json';

      // Build the file download
      var blob = new Blob([contents], {type : "application/json"});
      var url = window.URL.createObjectURL(blob);

      // Do the download
      chrome.downloads.download({
        url: url,
        filename: download_file
      });

      return false;
    });

    return false;
  });
});
