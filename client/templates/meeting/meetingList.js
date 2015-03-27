Template.meetingList.helpers({
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

Template.meetingList.rendered = function() {
  Session.set("memberSelectType", "");
  Session.set("hymnSelectType", "");

  Session.set("selectedOrganist", "");
  Session.set("selectedChorister", "");
  Session.set("selectedOpeningHymn", "");
  Session.set("selectedSacramentHymn", "");
  Session.set("selectedIntermediateHymn", "");
  Session.set("selectedClosingHymn", "");
  Session.set("selectedInvocation", "");
  Session.set("selectedBenediction", "");
  Session.set("selectedPresiding", "");
  Session.set("selectedConducting", "");
  Session.set("selectedAttendance", "");
  Session.set("memberSelectId", "");
};
