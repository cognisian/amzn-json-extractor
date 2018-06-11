// Wait till page has loaded
window.addEventListener("load", function () {

  // Ask the background script what tab this content script is running in
  // and then parse the info from that page
  chrome.runtime.sendMessage({type: 'query_tab', obj: null}, function(resp) {
      var tab = resp.tab

      var fullpath = '';

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
      fullpath = path.join('/');

      // chrome.runtime.sendMessage({type: "log", obj: fullpath});

      var d = $(document);

      // Test if we are on the paperback version
      var tmmswatches = d.find('div#tmmSwatches');
      var selectedSwatchElem = tmmswatches.find('li.swatchElement.selected');
      if (selectedSwatchElem.length != 0) {

        var format = selectedSwatchElem.find('a.a-button-text > span');
        if (format.text().indexOf('Paperback') >= 0) {

          // We are on correct page so find the Book title, isbn, authors, desc, images
          var descElems = $('iframe#bookDesc_iframe').contents();
          var descTextElems = $(descElems).find('div#iframeContent').contents();
          var descText = $(descTextElems).prop('outerHTML');
          if (typeof descText == 'undefined') {
            descText = $(descTextElems).map(function(i, e) {
              if (this.nodeType === 3) { return $(this).text(); }
              else { return $(this).prop('outerHTML'); }
            }).toArray().join('');
          }

          var productDetailsElems = $('table#productDetailsTable div.content ul');
          var isbnText = $(productDetailsElems).find('li:has(b:contains("ISBN-10:"))').text();

          var imageElem = $('img#imgBlkFront');
          var imageTypes = JSON.parse(imageElem.attr('data-a-dynamic-image'));
          var imageUrl = $(Object.keys(imageTypes)).filter(function(i, elem) {
            if (imageTypes[elem][1] > 399) { return true; }
            return false;
          })[0];

          var authorsElems = $('div#bylineInfo span.author a.contributorNameID');
          var authors = $(authorsElems).map(function(i, e) {
            return $(e).text();
          });

          // Collect the info
          var book = {
            'url': fullpath,
            'title': d.find('span#productTitle').text(),
            'isbn': isbnText.split(' ')[1],
            'desc': descText,
            'authors': authors.toArray(),
            'image': imageUrl
          };
          chrome.runtime.sendMessage({type: "create_book", book: book});
        }
      }
      else {
        chrome.runtime.sendMessage({type: "log", obj: 'Could not find Paperback details'});
        // Send message to popup
      }
  });
}, false);
