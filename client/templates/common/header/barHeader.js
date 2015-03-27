Template.barHeader.helpers({
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
  },
  isEqual: function(inValue1, inValue2) {
    return (inValue1 == inValue2);
  }
});

Template.barHeader.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "click #backButton": function(e, instance) {
    history.back();
  }
});
