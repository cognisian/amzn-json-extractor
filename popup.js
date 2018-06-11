// Wait till the UI loads to retrieve book data
$(document).ready(function() {

  // Query the background page for the book
  chrome.runtime.sendMessage({type: 'query_book'}, function(resp) {

    // Format the JSON to pretty print
    var contents = JSON.stringify(resp.book, null, 2);

    // Build string for downloaded file name
    var isbn = resp.book.isbn;
    var title = resp.book.title.replace(/ /g, '_')
    var download_file = isbn + '_' + title + '.json';

    // Get book display area
    var book_json_el = $('#book-json');
    $(book_json_el).append(contents);

    // Hook button up so it will download the json
    $('a#download-json').on('click', function(e) {

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
  });
});
