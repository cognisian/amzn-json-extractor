// chrome.runtime.sendMessage({type: "log", obj: fullpath});
//
// Chrome Extension content script to be injected into Amazon pages to
// extract book information and image URLs
//
// Check if the current page has the Paperback/Mass Paperback/Kindle format selected
function is_parsable() {

  var res = false;

  // Test if we are on the paperback version.  Amazon has different HTML layouts with
  // different id/class attributes for the book format component
  var format = '';

  var format_elms = $('div#tmmSwatches');
  if (format_elms.length > 0) {
    // Page is in 'Swatches' format
    var selected_format_elm = format_elms.find('li.swatchElement.selected');
    if (selected_format_elm.length != 0) {
      format = selected_format_elm.find('a.a-button-text span').text();
    }
  }
  else {
    // Page is in 'MediaTab' format
    format_elms = $('div#mediaTabsHeadings');
    if (format_elms.length > 0) {
      var selected_format_elm = format_elms.find('li.a-active');
      if (selected_format_elm.length != 0) {
        format = selected_format_elm.find('a span.mediaTab_title').text();
      }
    }
  }

  if (format.indexOf('Paperback') >= 0 || format.indexOf('Kindle') >= 0 ||
        format.indexOf('Hardcover') >= 0) {
      res = true;
  }

  return res;
}

// Given a URL retun the full path without the tracking/references
//
// @param chrome.tab The current open tab
// @return string The full path of the open URL
function parse_URL(tab) {

  var url = new URL(tab.url);
  var path = url.pathname.split('/');
  if (Array.isArray(path)) {
    // Strip out the ref= tracking out of the URL path
    var refPath = path[path.length - 1];
    if (refPath.substr(0, 3) == 'ref') {
      path = path.slice(0, path.length - 1);
    }
  }
  // First element will be empty string as it is the first '/' in the url pathname
  path[0] = url.origin;

  return path.join('/');
};

// From the page, extract the book ISBN
//
// @return string The ISBN-10 number
function parse_ISBN() {

  var prod_details_elms = $('table#productDetailsTable div.content ul');
  var isbn_text = $(prod_details_elms).find('li:has(b:contains("ISBN-10:"))').text();

  isbn_text = isbn_text.split(' ')[1];
  return isbn_text;
}

// From the page, extract the book ISBN
//
// @return string The ISBN-13 number
function parse_ISBN13() {

  var prod_details_elms = $('table#productDetailsTable div.content ul');
  var isbn_text = $(prod_details_elms).find('li:has(b:contains("ISBN-13:"))').text();

  isbn_text = isbn_text.split(' ')[1];
  return isbn_text;
}

// From the page, extract the book ISBN
//
// @return string The ISBN-13 number
function parse_ASIN() {

  var prod_details_elms = $('table#productDetailsTable div.content ul');
  var asin_text = $(prod_details_elms).find('li:has(b:contains("ASIN:"))').text();

  asin_text = asin_text.split(' ')[1];
  return asin_text;
}

// From the page, extract the book title
//
// @return string The book/kindle title
function parse_title() {

  // Get the title depends on format (paperbacak/hardcover/kindle)
  var title = $('span#productTitle').text();
  if (!title) {
    title = $('span#ebooksProductTitle').text();
  }

  var bracket = title.indexOf('(');
  // If title contains brackets then remove as it is not part of title
  if (bracket > 0) {
    // Cut out the actual title and remove trailing space between the
    // actual title and brackets
    title = title.substr(0, bracket - 1);
  }
  return title;
}

// From the page, extract the book ISBN
//
// @return array The array of author names
function parse_authors() {

  var authors_elms = $('div#bylineInfo span.author a.contributorNameID');
  var authors = $(authors_elms).map(function(i, e) {
    return $(e).text();
  });

  return authors.toArray();
}

// From the page, extract the book summary
//
// @return string The book summary with HTML formatting nodes
function parse_summary() {

  var desc_elms = $('iframe#bookDesc_iframe').contents();
  var desc_text_elms = $(desc_elms).find('div#iframeContent').contents();
  var desc_text = $(desc_text_elms).map(function(i, e) {
      if (this.nodeType === 3) { return $(this).text(); }
      else { return $(this).prop('outerHTML'); }
    }).toArray().join('');
    
  return desc_text;
}

// From the page, extract the book image URL
//
// @return string The book cover image URL
function parse_image() {

  var image_elm = $('img#imgBlkFront');
  if (image_elm.length == 0) {
    // Looking at Kindle swatch so different img #ID
    var image_elm = $('img#ebooksImgBlkFront');
  }
  var image_types = JSON.parse(image_elm.attr('data-a-dynamic-image'));
  var image_url = $(Object.keys(image_types)).filter(function(i, elem) {
    // Find the medium image based on height coord
    if (image_types[elem][1] > 399) { return true; }
    return false;
  })[0];

  return image_url;
}

// From the page, extract the averge book rating
//
// @return float The book average customer rating
function parse_rating() {

  var ratings_elm = $('div#averageCustomerReviews i.a-icon-star span');
  var ratings_text = ratings_elm.text().split(' ')[0];

  return parseFloat(ratings_text);
}

//////////////////////////////////////////////////////////////////////////////
// Entry Point
//////////////////////////////////////////////////////////////////////////////
$(document).ready(function() {

  // Get the book details from the web page
  chrome.runtime.sendMessage({type: 'query_tab', obj: null}, function(resp) {

    // Set the icon if thecurrent Swatch is parseable (ie Paperback/Kindle)
    chrome.runtime.sendMessage({type: 'update_tab', obj: is_parsable()});

    // Get the book data from the page
    if (is_parsable()) {
      // Collect the info from the Paperback format
      var book = {
        'url':      parse_URL(resp.tab),
        'title':    parse_title(),
        'isbn':     parse_ISBN() || parse_ISBN13() || parse_ASIN(),
        'summary':  parse_summary(),
        'authors':  parse_authors(),
        'image':    parse_image(),
        'rating':   parse_rating()
      };
      // Send to background page
      chrome.runtime.sendMessage({type: "create_book", book: book});
    }
    else {
      chrome.runtime.sendMessage({type: "log", obj: 'Could not find Paperback details'});
    }
  });
});
