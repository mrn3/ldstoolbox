Template.member.rendered = function() {
  /*
  if (this.data
    && this.data.householdData
    && this.data.householdData.headOfHouse
    && this.data.householdData.headOfHouse.indiviualId)
  Meteor.call("getHousehold", parseInt(this.data.householdData.headOfHouse.indiviualId), function(error) {
    if (error) {
      console.log(error);
    }
  });
  */
}

Template.member.helpers({
  formattedMeetingDate: function() {
    console.log(this)
    return moment(this.meetingDate).format("dddd, MMMM D, YYYY");
  }
});

Template.member.events({
  "click [data-action=showAddressActionSheet]": function (event, template) {
    var household = this;
    IonActionSheet.show({
      buttons: [
        { text: "View Map"},
        { text: "Get Directions in Google Maps" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Router.go("/householdMap/" + household._id);
        }
        if (index === 1) {
          if (household
            && household.desc1
            && household.includeLatLong
            && household.latitude
            && household.longitude) {
              var theLocation;
              var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
              if (iOS) {
                theLocation = "comgooglemaps-x-callback://?";
              } else {
                theLocation = "https://www.google.com/maps?";
              }
              theLocation +=
                "saddr=";
              theLocation +=
                "&daddr=";
              if (household.desc1) {
                theLocation += household.desc1;
              }
              if (household.desc2) {
                theLocation += "," + household.desc2;
              }
              if (household.desc3) {
                theLocation += "," + household.desc3;
              }
              if (household.desc4) {
                theLocation += "," + household.desc4;
              }
              theLocation +=
                "&center=" + household.latitude + "," +
                              household.longitude +
                "&zoom=17" +
                "&views=traffic" +
                "&directionsmode=driving" +
                "&dirflg=d" +
                "&x-success=sourceapp://?resume=true" +
                "&x-source=LDS+Toolbox";
              if (iOS) {
                window.location = theLocation;
              } else {
                window.open(theLocation);
              }
          }
        }
        return true;
      }
    });
  },
  "click [data-action=showIndividualPhoneActionSheet]": function (event, template) {
    var member = this;
    IonActionSheet.show({
      buttons: [
        { text: "Call"},
        { text: "Send Text Message" },
        { text: "Copy To Clipboard" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          window.location = "tel:" + member.phone;
        }
        if (index === 1) {
          window.location = "sms:" + member.phone;
        }
        if (index === 2) {
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<input type='text' value='" + member.phone + "' onClick='this.setSelectionRange(0, this.value.length)'>",
            okText: 'Okay',
          });
        }
        return true;
      }
    });
  },
  "click [data-action=showHouseholdPhoneActionSheet]": function (event, template) {
    var household = this;
    IonActionSheet.show({
      buttons: [
        { text: "Call"},
        { text: "Send Text Message" },
        { text: "Copy To Clipboard" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          window.location = "tel:" + household.phone;
        }
        if (index === 1) {
          window.location = "sms:" + household.phone;
        }
        if (index === 2) {
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<input type='text' value='" + household.phone + "' onClick='this.setSelectionRange(0, this.value.length)'>",
            okText: 'Okay',
          });
        }
        return true;
      }
    });
  },
  "click [data-action=showIndividualEmailActionSheet]": function (event, template) {
    var member = this;
    IonActionSheet.show({
      buttons: [
        { text: "Send Email"},
        { text: "Copy To Clipboard" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          window.location = "mailto:" + member.email;
        }
        if (index === 1) {
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<input type='text' value='" + member.email + "' onClick='this.setSelectionRange(0, this.value.length)'>",
            okText: 'Okay',
          });
        }
        return true;
      }
    });
  },
  "click [data-action=showHouseholdEmailActionSheet]": function (event, template) {
    var household = this;
    IonActionSheet.show({
      buttons: [
        { text: "Send Email"},
        { text: "Copy To Clipboard" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          window.location = "mailto:" + household.emailAddress;
        }
        if (index === 1) {
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<input type='text' value='" + household.emailAddress + "' onClick='this.setSelectionRange(0, this.value.length)'>",
            okText: 'Okay',
          });
        }
        return true;
      }
    });
  }
});
