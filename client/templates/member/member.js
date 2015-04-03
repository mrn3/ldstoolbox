Template.member.rendered = function() {
  /*
  if (this.data
    && this.data.householdData
    && this.data.householdData.headOfHousehold
    && this.data.householdData.headOfHousehold.indiviualId)
  Meteor.call("getHousehold", parseInt(this.data.householdData.headOfHousehold.indiviualId), function(error) {
    if (error) {
      console.log(error);
    }
  });
  */
}

Template.member.events({
  'click [data-action=showAddressActionSheet]': function (event, template) {
    var household = this;
    IonActionSheet.show({
      buttons: [
        { text: "View Map"},
        { text: 'View in Google Maps' },
      ],
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Router.go("/householdMap/" + household._id);
        }
        if (index === 1) {
          window.location = "comgooglemaps://?center=40.765819,-73.975866&zoom=14&views=traffic";
        }
        return true;
      }
    });
  }
});
