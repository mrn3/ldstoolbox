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
  'click #incrementOneAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") + 1);
  },
  'click #decrementOneAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") - 1);
  },
  'click #incrementTenAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") + 10);
  },
  'click #decrementTenAttendanceButton': function(e, instance){
    Session.set("selectedAttendance", Session.get("selectedAttendance") - 10);
  },
  "click #doneButton": function(e, instance) {
    history.back();
  }
});

Template.attendanceSelect.rendered = function() {
  if ((typeof Session.get("selectedAttendance") == "undefined") || (Session.get("selectedAttendance") == "")) {
    Session.set("selectedAttendance", 0);
  }
}
