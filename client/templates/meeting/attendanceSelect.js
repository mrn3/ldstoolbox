Template.attendanceSelect.helpers({
  attendanceSession: function() {
    if (typeof Session.get("selectedAttendance") == "undefined") {
      return "";
    } else {
      return Session.get("selectedAttendance");
    }
  }
});

Template.attendanceSelect.events({
  'click #incrementAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") + 1);
  },
  'click #decrementAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") - 1);
  }
});

Template.attendanceSelect.rendered = function() {
  if ((typeof Session.get("selectedAttendance") == "undefined") || (Session.get("selectedAttendance") == "")) {
    Session.set("selectedAttendance", 0);
  }
}
