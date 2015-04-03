Template.householdList.rendered = function() {
  Meteor.subscribe("wardHouseholdPublication");
}

Template.householdList.helpers({
  householdData: function() {
    return householdCollection.find({}, {sort: {coupleName: 1}})
  }
});

Template.householdList.events({
  'click [data-action=showSortActionSheet]': function (event, template) {
    IonActionSheet.show({
      buttons: [
        { text: "Households"},
        { text: 'Members' },
      ],
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Router.go("householdList");
        }
        if (index === 1) {
          Router.go("memberList");
        }
        return true;
      }
    });
  }
});
