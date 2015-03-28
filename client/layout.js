Template.layout.helpers({
  selectedTypeOption: function(value){
    if (Session.get("typeSelector") == value) {
      return {selected: "selected"};
    } else {
      return "";
    }
  },
  selectedStatusOption: function(value){
    if (Session.get("statusSelector") == value) {
      return {selected: "selected"};
    } else {
      return "";
    }
  },
  userCanViewCallingChangeList: function () {
    if (Meteor.user() && Meteor.user().callings) {

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

Template.layout.events({
  "change #statusSelector": function(e, instance){
    Session.set("statusSelector", $('#statusSelector').val());
  },
  "change #typeSelector": function(e, instance){
    Session.set("typeSelector", $('#typeSelector').val());
  }
});

Template.layout.rendered = function(){
  if (typeof Session.get("typeSelector") == "undefined") {
    Session.set("typeSelector", "All");
  }
  if (typeof Session.get("statusSelector") == "undefined") {
    Session.set("statusSelector", "Incomplete");
  }
};
