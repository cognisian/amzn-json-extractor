// Global var
var book = {}

// Receive any messages from content scripts or extension's UI popup script
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

  switch(message.type) {
    case "log":
      console.log(message.obj);
      break;
    case "query_tab":
      sendResponse({tab: sender.tab});
      break;
    case "update_tab":
      if (message.obj) {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: "images/icon-go.png"});
      }
      else {
        chrome.browserAction.setIcon({tabId: sender.tab.id, path: "images/icon-no.png"});
      }
      break;
    case "query_book":
      sendResponse({book: book});
      break;
    case "create_book":
      book = message.book;
      break;
    case "update_book":
      book[message.term] = message.obj;
      break;
  };
});

// Set the list of Genres, Periods and Locations
chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.set({
    genres: [
      "Action & Adventure", "Ancient Civilizations", "Ancient Greece",
      "Ancient Rome", "Art & Architecture", "Biography",
      "Business & Finance", "Children's Books", "Cold War",
      "Comics & Graphic Novels", "Drama", "Erotica",
      "Essay", "Fantasy", "Fiction & Literature",
      "Film", "Folklore & Mythology", "Food and Wine",
      "Guide Books", "Historical Fiction", "History",
      "Humour", "Journalism", "LGBT",
      "Literary Theory & Criticism", "Magazines", "Memoir",
      "Music", "Mystery & Suspense", "Photography",
      "Poetry", "Politics", "Pop Culture",
      "Religion", "Renaissance", "Romance",
      "Satire", "Science Fiction", "Science & Nature",
      "Social & Cultural Studies", "Spanish Civil War", "Sport",
      "The Depression", "Travel Writing", "True Crime",
      "Urbanism", "Weimar Republic", "Women's Fiction",
      "WWI", "WWII", "Young Adult"
    ]
  });
  chrome.storage.sync.set({
    periods: [
      "0-500s", "1500s", "1600s", "1700s", "1800s", "1900s", "1910s", "1920s",
      "1930s", "1940s", "1950s", "1960s", "1970s", "1980s", "1990s", "2000s",
      "2010s", "500-1400s", "Pre Common Era", "Recent Releases"
    ]
  });
  chrome.storage.sync.set({
    locations: [
      {city: "Albany", country: "USA"},
      {city: "Alexandria", country: "Egypt"},
      {city: "Algiers", country: "Algeria"},
      {city: "Amsterdam", country: "Netherlands"},
      {city: "Andalucia", country: "Spain"},
      {city: "Ankara", country: "Turkey"},
      {city: "Antalya", country: "Turkey"},
      {city: "St. John's", country: "Antigua and Barbuda"},
      {city: "Antwerp", country: "Netherlands"},
      {city: "Aracataca", country: "Colombia"},
      {city: "Athens", country: "Greece"},
      {city: "Auschwitz", country: "Poland"},
      {city: "Austin", country: "USA"},
      {city: "Baghdad", country: "Iraq"},
      {city: "Bangkok", country: "Thailand"},
      {city: "Bankipur", country: "India"},
      {city: "Barcelona", country: "Spain"},
      {city: "Basque Country", country: "Spain"},
      {city: "Belgrade", country: "Serbia"},
      {city: "Benghazi", country: "Lybia"},
      {city: "Berlin", country: "Germany"},
      {city: "Bismark Archipelago", country: "Papua New Guinea"},
      {city: "Bogota", country: "Colombia"},
      {city: "Boston", country: "USA"},
      {city: "Brisbane", country: "Australia"},
      {city: "Brooklyn", country: "USA"},
      {city: "Bruges", country: "Belgium"},
      {city: "Brussels", country: "Belgium"},
      {city: "Bucharest", country: "Bulgaria"},
      {city: "Budapest", country: "Hungary"},
      {city: "Buenos Aires", country: "Argentina"},
      {city: "Byron Bay", country: "Australia"},
      {city: "Cairo", country: "Egypt"},
      {city: "Calcutta", country: "India"},
      {city: "Cancun", country: "Mexico"},
      {city: "Cannes", country: "France"},
      {city: "Cape Town", country: "South Africa"},
      {city: "Carpentaria", country: "Australia"},
      {city: "Cartagena", country: "Colombia"},
      {city: "George Town", country: "Cayman Islands"},
      {city: "Cephalonia", country: "Greece"},
      {city: "Chicago", country: "USA"},
      {city: "Colombo", country: "Sri Lanka"},
      {city: "Copenhagen", country: "Denmark"},
      {city: "Corsica", country: "Italy"},
      {city: "San Jose", country: "Costa Rica"},
      {city: "Prague", country: "Czechia"},
      {city: "Dallas", country: "USA"},
      {city: "Delhi", country: "India"},
      {city: "Denver", country: "USA"},
      {city: "Dijon", country: "France"},
      {city: "Roseau", country: "Dominica"},
      {city: "Dresden", country: "Germany"},
      {city: "Dubai", country: "UAE"},
      {city: "Dublin", country: "Ireland"},
      {city: "Eugene", country: "USA"},
      {city: "Florence", country: "Itlay"},
      {city: "Frankfurt", country: "Germany"},
      {city: "Galápagos Islands", country: "Ecuador"},
      {city: "Gallipoli", country: "Turkey"},
      {city: "Geneva", country: "Switzerland"},
      {city: "Accra", country: "Ghana"},
      {city: "Grozny", country: "Chechnya"},
      {city: "Guadeloupe", country: "Mexico"},
      {city: "Guanajuato City", country: "Mexico"},
      {city: "Port-au-Prince", country: "Haiti"},
      {city: "Hanoi", country: "Vietnam"},
      {city: "Havana", country: "Cuba"},
      {city: "Helsinki", country: "Finland"},
      {city: "Ho Chi Minh City", country: "Vietnam"},
      {city: "Hong Kong", country: "Hong Kong"},
      {city: "Honolulu", country: "USA"},
      {city: "Ibiza", country: "Spain"},
      {city: "Jerusalem", country: "Israel"},
      {city: "Johannesburg", country: "South Africa"},
      {city: "Amman", country: "Jordan"},
      {city: "Kabul", country: "Afghanistan"},
      {city: "Kathmandu", country: "Nepal"},
      {city: "Astana", country: "Kazakhstan"},
      {city: "Khartoum", country: "Sudan"},
      {city: "Kinshasa", country: "DR Congo"},
      {city: "Kraków", country: "Poland"},
      {city: "Kuwait City", country: "Kuwait"},
      {city: "Lafayette County", country: "USA"},
      {city: "Lahore", country: "Pakistan"},
      {city: "Las Vegas", country: "USA"},
      {city: "Lima", country: "Peru"},
      {city: "Lisbon", country: "Portugal"},
      {city: "London", country: "England"},
      {city: "Los Angeles", country: "USA"},
      {city: "Lyon", country: "France"},
      {city: "Madrid", country: "Spain"},
      {city: "Male", country: "Maldives"},
      {city: "Malmo", country: "Sweden"},
      {city: "Fort-de-France", country: "Martinique"},
      {city: "Medellin", country: "Colombia"},
      {city: "Melbourne", country: "Australia"},
      {city: "Mexico City", country: "Mexico"},
      {city: "Miami", country: "USA"},
      {city: "Milan", country: "Itlay"},
      {city: "Montego Bay", country: "Jamaica"},
      {city: "Monterey", country: "USA"},
      {city: "Montreal", country: "Canada"},
      {city: "Rabat", country: "Morocco"},
      {city: "Moscow", country: "Russia"},
      {city: "Mount Everest", country: "Nepal"},
      {city: "Mumbai", country: "India"},
      {city: "Naypyidaw", country: "Myanmar"},
      {city: "Naples", country: "Italy"},
      {city: "New Brunswick", country: "Canada"},
      {city: "New Hampshire", country: "USA"},
      {city: "New Mexico", country: "USA"},
      {city: "New Orleans", country: "USA"},
      {city: "New York", country: "USA"},
      {city: "Nice", country: "France"},
      {city: "Nordland", country: "Norway"},
      {city: "Novi Sad", country: "Serbia"},
      {city: "Oakland", country: "USA"},
      {city: "Odessa", country: "Ukraine"},
      {city: "Oran", country: "Algeria"},
      {city: "Oslo", country: "Norway"},
      {city: "Oxford", country: "England"},
      {city: "Ramallah", country: "Palestine"},
      {city: "Palm Island", country: "UAE"},
      {city: "Pamplona", country: "Spain"},
      {city: "Panama City", country: "Panama"},
      {city: "Paris", country: "France"},
      {city: "Perth", country: "Australia"},
      {city: "Philadelphia", country: "USA"},
      {city: "Portland", country: "USA"},
      {city: "Porto", country: "Portugal"},
      {city: "Provence", country: "France"},
      {city: "San Juan", country: "Puerto Rico"},
      {city: "Quito", country: "Peru"},
      {city: "Reykjavik", country: "Iceland"},
      {city: "Rio de Janeiro", country: "Brazil"},
      {city: "Rome", country: "Italy"},
      {city: "Sag Harbor", country: "USA"},
      {city: "Saint Helena", country: "USA"},
      {city: "Castries", country: "Saint Lucia"},
      {city: "Marigot", country: "Saint Martin"},
      {city: "Salamanca", country: "Spain"},
      {city: "Salvador", country: "Brazil"},
      {city: "San Francisco", country: "USA"},
      {city: "San Miguel de Allende", country: "Mexico"},
      {city: "San Sebastian", country: "Spain"},
      {city: "Santiago de Compostela", country: "Spain"},
      {city: "Santo Domingo", country: "Dominican Republic"},
      {city: "Sao Paolo", country: "Brazil"},
      {city: "Sarajevo", country: "Bosnia and Herzegovina"},
      {city: "Sardinia", country: "Italy"},
      {city: "Riyadh", country: "Saudi Arabia"},
      {city: "Seattle", country: "USA"},
      {city: "Shanghai", country: "China"},
      {city: "Shenzhen", country: "China"},
      {city: "Sicily", country: "Italy"},
      {city: "Singapore", country: "Singapore"},
      {city: "Stockholm", country: "Sweden"},
      {city: "St Petersburg", country: "Russia"},
      {city: "Sydney", country: "Australia"},
      {city: "Tangiers", country: "Morocco"},
      {city: "Tehran", country: "Iran"},
      {city: "Tel Aviv", country: "Israel"},
      {city: "The Sologne", country: "France"},
      {city: "Tijuana", country: "Mexico"},
      {city: "Tokyo", country: "Japan"},
      {city: "Toledo", country: "Spain"},
      {city: "Toronto", country: "Canada"},
      {city: "Toulouse", country: "France"},
      {city: "Trieste", country: "Italy"},
      {city: "Port au Spain", country: "Trinidad and Tobago"},
      {city: "Tripoli", country: "Lybia"},
      {city: "Vancouver", country: "canada"},
      {city: "Venice", country: "Italy"},
      {city: "Vienna", country: "Austria"},
      {city: "Višegrad", country: "Russia"},
      {city: "Warsaw", country: "Poland"},
      {city: "Washington D.C.", country: "USA"},
      {city: "Yandina", country: "Australia"},
      {city: "Zurich", country: "Switzerland"}
    ]
  });
});
