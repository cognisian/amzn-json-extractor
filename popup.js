// Event handler for Chips autocomplete
function add_book_prop(el, chip) {
  chrome.runtime.sendMessage({
    type: 'add_book_prop',
    term: el.attr('id'),
    obj: $($(chip).contents()[0]).text()
  });
}

// Event handler for Chips autocomplete
function del_book_prop(el, chip) {
  chrome.runtime.sendMessage({
    type: 'del_book_prop',
    term: el.attr('id'),
    obj: $($(chip).contents()[0]).text()
  });
}

// Create the drop down options for materialize "Chips" from chrome local
// storage of array of strings
function create_chips_from_strings(storage_key, elem_id) {
  chrome.storage.sync.get(storage_key, function(result) {
    var values = {};
    $.each(result[storage_key], function(idx, val) {
      if (!values[val]) {
        // Create the dit value in materialize format: {value: img tag,}
        // as we are not using the image tag so null values
        values[val] = null;
      }
    });
    $('#' + elem_id).chips({
      autocompleteOptions: {
        data: values,
      },
      placeholder: 'Search for ' + storage_key,
      secondaryPlaceholder: storage_key,
      onChipAdd: add_book_prop,
      onChipDelete: del_book_prop,
      limit: Infinity,
      minLength: 1
    });
  });
}

// Create the drop down options for materialize "Chips" from chrome local
// storage of array of dicts
function create_chips_from_dict(storage_key, elem_id) {
  chrome.storage.sync.get(storage_key, function(result) {
    var temp = result[storage_key].sort(function(a, b) {
      return (a.country.localeCompare(b.country) ||
                a.city.localeCompare(b.city));
    });
    var values = {};
    $.each(temp, function(idx, val) {
      key = val.city + ", " + val.country;
      if (!values[key]) {
        // Create the dit value in materialize format: {value: img tag,}
        // as we are not using the image tag so null values
        values[key] = null;
      }
    });
    $('#' + elem_id).chips({
      autocompleteOptions: {
        data: values,
      },
      placeholder: 'Search for ' + storage_key,
      secondaryPlaceholder: storage_key,
      onChipAdd: add_book_prop,
      onChipDelete: del_book_prop,
      limit: Infinity,
      minLength: 1
    });
  });
}

///////////////////////////////////////////////////////////////////////////////
// ENTRY POINT
///////////////////////////////////////////////////////////////////////////////

// Wait till the UI loads to retrieve book data
$(document).ready(function() {

  // Initialize the Materialize CSS components
  M.AutoInit();

  // Populate the Genres/Periods/Locations input
  // $('.chips').chips();
  create_chips_from_strings('genres', 'genres');
  create_chips_from_strings('periods', 'periods');
  create_chips_from_dict('locations', 'locations');

  // Query the background page for the book
  chrome.runtime.sendMessage({type: 'query_book'}, function(resp) {

    // Format the JSON to pretty print
    // var contents = JSON.stringify(resp.book, null, 2);

    // Set the fields
    $('#isbn').val(resp.book.isbn);
    $('#title').val(resp.book.title);
    $('#rating').val(resp.book.rating + ' stars');
    $('#summary').val(resp.book.summary);
    $('#authors').val(resp.book.authors.join(', '));
  });

  //
  // Hook up text area to update book when it loses focus
  //
  $('#summary').on('focusout', function(evt) {
    console.log($(this).val());
    chrome.runtime.sendMessage({
      type: 'update_book',
      term: 'summary',
      obj: $(this).val()
    });
  });

  //
  // Hook button up so it will download the json
  //
  $('a#download-json').on('click', function(e) {

    // Query the background page for the book
    chrome.runtime.sendMessage({type: 'query_book'}, function(resp) {

      // Format the JSON to pretty print
      var contents = JSON.stringify(resp.book, null, 2);

      // Build string for downloaded file name
      var isbn = resp.book.isbn;
      var title = resp.book.title.replace(/ /g, '_')
      var download_file = isbn + '_' + title;

      // Build the file download
      var blob = new Blob([contents], {type : "application/json"});
      var url = window.URL.createObjectURL(blob);

      // Do the download
      download_file = download_file.replace(/[^a-zA-Z0-9-_]/g, '');
      download_file = download_file + '.json';
      chrome.downloads.download({
        url: url,
        filename: download_file
      });

    });

    return false;
  });
});
