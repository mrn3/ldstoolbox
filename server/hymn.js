SearchSource.defineSource('hymns', function(searchText, options) {
  var options = {sort: {"number": 1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {"name": regExp},
      {"number": regExp}
    ]};
    console.log(hymnCollection.find(selector, options).fetch());
    return hymnCollection.find(selector, options).fetch();
  } else {
    return hymnCollection.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
