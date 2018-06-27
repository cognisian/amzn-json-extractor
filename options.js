// Add a new value to an array of string in local storage
function add_new_value(elem, storage_key, display_list_id) {

  // Get the text to be added and add to list
  var value = $(elem).val();
  var option = $("<li>").text(value).addClass('collection-item');
  $('#' + display_list_id).append(option);

  // Append new item to stored items
  chrome.storage.sync.get(storage_key, function(result) {
    // Get old list and append new item
    var values = result[storage_key];
    values.push(value);
    // Save new list to storage
    var save = {};
    save[storage_key] = values;
    chrome.storage.sync.set(save);
  });
}

// Add a new dict to an array of dict in local storage
function add_new_dict(elem, storage_key, display_list_id) {

  // Get the text to be added and add to list
  var value = $(elem).val();
  // Split on a comma and trim
  var value_elms = value.split(',');
  var loc = {city: '', country: ''};
  loc.city = value_elms[0].trim();
  if (value_elms.length == 2) {
    loc.country = value_elms[1].trim();
  }

  // Add to list UI
  var option = $("<li>").text(value).addClass('collection-item');
  $('#' + display_list_id).append(option);

  // Append new item to stored items
  chrome.storage.sync.get(storage_key, function(result) {
    var values = result[storage_key];
    values.push(loc);
    // Save new list to storage
    var save =  {};
    save[storage_key] = values;
    chrome.storage.sync.set(save);
  });
}

$(document).ready(function() {

  // Initialize the Materialize select component
  // var elems = document.querySelectorAll('select');
  // var instances = M.FormSelect.init(elems);

  // Get the options from storage
  chrome.storage.sync.get('genres', function(result) {
    $.each(result.genres, function(idx, value) {
      var option =
        $("<li>").text(value).addClass('collection-item');
      $('#genres-list').append(option);
    });
  });

  chrome.storage.sync.get('periods', function(result) {
    $.each(result.periods, function(idx, value) {
      var option =
        $("<li>").text(value).addClass('collection-item');
      $('#periods-list').append(option);
    });
  });

  chrome.storage.sync.get('locations', function(result) {
    var temp = result.locations.sort(function(a, b) {
      return (a.country.localeCompare(b.country) ||
                a.city.localeCompare(b.city));
    });
    $.each(temp, function(idx, value) {
      var loc_text = value.country + ", " + value.city;
      var option =
        $("<li>").text(loc_text).addClass('collection-item');
      $('#locations-list').append(option);
    });
  });

  // When user hits enter add it to the list and local storage
  $('input#genre').keypress(function(evt) {
    if (evt.which == 13) {
      evt.preventDefault();

      add_new_value(this, 'genres', 'genres-list')

      // Clear the text input
      $(this).val('');
    }
  });

  $('input#period').keypress(function(evt) {
    if (evt.which == 13) {
      evt.preventDefault();

      add_new_value(this, 'periods', 'periods-list')

      // Clear the text input
      $(this).val('');
    }
  });

  $('input#location').keypress(function(evt) {
    if (evt.which == 13) {
      evt.preventDefault();

      add_new_dict(this, 'locations', 'locations-list')

      // Clear the text input
      $(this).val('');
    }
  });
});
