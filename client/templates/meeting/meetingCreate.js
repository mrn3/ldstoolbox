Template.meetingCreate.helpers({
  userCanCreateMeeting: function () {
    if (Meteor.user().callings) {

      //bishop, counselors, executive secretary, ward clerk, membership clerk
      var allowedCallingList = [4, 54, 55, 56, 57, 787];
      var userCallingList = Meteor.user().callings.reduce(
        function(total, calling){
          return total.concat(calling.positionId);
        },
      []);

      var callingIntersection =
        userCallingList.filter(function(n) {
          return allowedCallingList.indexOf(n) != -1
        });

      return (callingIntersection.length > 0);
    }
  }
});

Template.meetingCreate.events({
  'click #cancelButton': function(e, instance) {
    history.back();
  },
  'click #doneButton': function(e, instance) {
    e.preventDefault();

    var meeting = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      meetingDate:          $('#meetingDate').val(),
      fastAndTestimony:     $('#fastAndTestimony').prop("checked"),
      presiding:            Session.get("selectedPresiding"),
      conducting:           Session.get("selectedConducting"),
      attendance:           Session.get("selectedAttendance"),
      organist:             Session.get("selectedOrganist"),
      chorister:            Session.get("selectedChorister"),
      openingHymn:          Session.get("selectedOpeningHymn"),
      sacramentHymn:        Session.get("selectedSacramentHymn"),
      intermediateHymn:     Session.get("selectedIntermediateHymn"),
      musicalNumber:        $('#musicalNumber').val(),
      closingHymn:          Session.get("selectedClosingHymn"),
      invocation:           Session.get("selectedInvocation"),
      benediction:          Session.get("selectedBenediction"),
      recognition1Type:     $('#recognition1Type').val(),
      recognition1Person1:  $('#recognition1Person1').val(),
      recognition1Person2:  $('#recognition1Person2').val(),
      recognition1Person3:  $('#recognition1Person3').val(),
      recognition2Type:     $('#recognition2Type').val(),
      recognition2Person1:  $('#recognition2Person1').val(),
      recognition2Person2:  $('#recognition2Person2').val(),
      recognition2Person3:  $('#recognition2Person3').val(),
      recognition3Type:     $('#recognition3Type').val(),
      recognition3Person1:  $('#recognition3Person1').val(),
      recognition3Person2:  $('#recognition3Person2').val(),
      recognition3Person3:  $('#recognition3Person3').val()
    };

    if (properties) {
      Meteor.call('insertMeeting', properties, function(error, meeting) {
        if (error) {
          console.log(error.reason);
        } else {
          history.back();
        }
      });
    }
  }
});
