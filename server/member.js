SearchSource.defineSource("members", function(searchText) {
  var options = {sort: {"preferredName": 1}, limit: 20};

  var selector;
  if (searchText) {
    var regExp = buildRegExp(searchText);
    if (Meteor.user().selectedWardUnitNo) {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          wardUnitNo: Meteor.user().selectedWardUnitNo,
          $or: [
            {"preferredName": regExp},
            {"callings.callingName": regExp}
          ]
        };
    } else {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          $or: [
            {"preferredName": regExp},
            {"callings.callingName": regExp}
          ]
        };
    }
    return memberCollection.find(selector, options).fetch();
  } else {
    return [];
    /*
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
    return memberCollection.find(selector, options).fetch();
    */
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

Meteor.methods({
  setUserSelectedWardUnitNo: function(inSelectedWardUnitNo) {
    this.unblock();
    try {
      var updateObject = {};
      updateObject.$set = {selectedWardUnitNo: inSelectedWardUnitNo};
      Meteor.users.update(this.userId, updateObject);
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});
