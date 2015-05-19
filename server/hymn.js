SearchSource.defineSource("hymns", function(searchText, options) {
  var options = {sort: {"number": 1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector =
    {
      $and:
      [
        {
          $or:
            [
              {"name": regExp},
              {"numberText": regExp}
            ]
        }
      ]
    };

    if (Meteor.user().includePrimarySongs == false) {
      selector['$and'].push({type: "hymn"});
    }

    return hymnCollection.find(selector, options).fetch();
  } else {
    return [];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

Meteor.methods({
  setIncludePrimarySongs: function(inIncludePrimarySongs) {
    this.unblock();
    try {
      var updateObject = {};
      updateObject.$set = {includePrimarySongs: inIncludePrimarySongs};
      Meteor.users.update(this.userId, updateObject);
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});
