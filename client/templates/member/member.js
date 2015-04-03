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
        { text: "Get Directions in Google Maps" }
      ],
      cancelText: 'Cancel',
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Router.go("/householdMap/" + household._id);
        }
        if (index === 1) {
          if (household
            && household.householdInfo
            && household.householdInfo.address
            && household.householdInfo.address.latitude
            && household.householdInfo.address.longitude) {
              var theLocation;
              var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
              if (iOS) {
                theLocation = "comgooglemaps-x-callback://?";
              } else {
                theLocation = "https://www.google.com/maps?";
              }
              theLocation +=
                "saddr=" +
                "&daddr=" + household.householdInfo.address.addr1 + "," + household.householdInfo.address.addr2 + "," + household.householdInfo.address.addr3 + "," + household.householdInfo.address.addr4 +
                "&center=" + household.householdInfo.address.latitude + "," + household.householdInfo.address.longitude +
                "&zoom=17" +
                "&views=traffic" +
                "&directionsmode=driving" +
                "&dirflg=d" +
                "&x-success=sourceapp://?resume=true" +
                "&x-source=LDS+Toolbox";
              //console.log(theLocation);
              window.open(theLocation);
          }
        }
        return true;
      }
    });
  }
});
