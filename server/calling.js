Meteor.methods({
  getCallings: function() {
    this.unblock();
    try {
      var pipeline = [
        {$project:{a:'$leaders.callingName'}},
        {$unwind:'$a'},
        {$group:{_id:'a',res:{$addToSet:'$a'}}}
      ];
      var result = callingGroupCollection.aggregate(pipeline);
      //console.log(result);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});

SearchSource.defineSource('callings', function(searchText, options) {
  var options = {sort: {"callingName": 1}, limit: 20};

  var selector;
  if (searchText) {
    var regExp = buildRegExp(searchText);
    if (Meteor.user().selectedWardUnitNo) {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          wardUnitNo: Meteor.user().selectedWardUnitNo,
          $or: [
            {"displayName": regExp},
            {"callingName": regExp}
          ]
        };
    } else {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          $or: [
            {"displayName": regExp},
            {"callingName": regExp}
          ]
        };
    }
    return callingCollection.find(selector, options).fetch();
  } else {
    if (Meteor.user().selectedWardUnitNo) {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          wardUnitNo: Meteor.user().selectedWardUnitNo
        };
    } else {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo
        };
    }
    return callingCollection.find(selector, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
