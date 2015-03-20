Template.householdList.rendered = function() {
  Meteor.subscribe("householdPublication");
}

Template.householdList.helpers({
  householdData: function() {
    return householdCollection.find({}, {sort: {householdName: 1}})
  }
});
