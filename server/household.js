SearchSource.defineSource("households", function(searchText) {
  var options = {sort: {"coupleName": 1}, limit: 20};

  var selector;
  if (searchText) {
    var regExp = buildRegExp(searchText);
    if (Meteor.user().selectedWardUnitNo) {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          wardUnitNo: Meteor.user().selectedWardUnitNo,
          $or: [
            {"coupleName": regExp},
            {"headOfHousehold.name": regExp},
            {"spouse.name": regExp},
            {"otherHouseholdMembers.name": regExp}
          ]
        };
    } else {
      selector =
        {
          stakeUnitNo: Meteor.user().stakeUnitNo,
          $or: [
            {"coupleName": regExp},
            {"headOfHousehold.name": regExp},
            {"spouse.name": regExp},
            {"otherHouseholdMembers.name": regExp}
          ]
        };
    }
    return householdCollection.find(selector, options).fetch();
  } else {
    return [];
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
