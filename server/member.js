SearchSource.defineSource('members', function(searchText, options) {
  var options = {sort: {"switchedPreferredName": 1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {"switchedPreferredName": regExp},
      {"callings.callingName": regExp}
    ]};

    return memberCollection.find(selector, options).fetch();
  } else {
    return memberCollection.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
