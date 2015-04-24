Template.unitSelect.helpers({
  unitData: function(){
    return unitCollection.find({});
  },
  isSelectedUnit: function(inWardUnitNo) {
    if (Session.get("selectedWardUnitNo") == inWardUnitNo) {
      return "selected";
    } else {
      return "";
    }
  },
  userData: function() {
    return Meteor.user();
  }
});

Template.unitSelect.events({
  "change #unitSelect": function(event, instance) {
    Session.set("selectedWardUnitNo", event.target.value);
    Meteor.call("setUserSelectedWardUnitNo", parseInt(event.target.value));
    if (Router && Router.current() && Router.current().route && Router.current().route.getName()) {
      if (Router.current().route.getName() === "memberSelect") {
        var text = $("#memberSearchInput").val().trim();
        memberSearch.search(text);
      } else if (Router.current().route.getName() === "callingSelect") {
        var text = $("#callingSearchInput").val().trim();
        callingSearch.search(text);
      } else if (Router.current().route.getName() === "householdList") {
        window.location = "/householdList";
      } else if (Router.current().route.getName() === "memberList") {
        window.location = "/memberList";
      } else if (Router.current().route.getName() === "callingGroupList") {
        window.location = "/callingGroupList";
      } else if (Router.current().route.getName() === "organizationList") {
        window.location = "/organizationList";
      }
    }
  }
});

Template.unitSelect.rendered = function() {
  Meteor.subscribe("unitPublication");
  Meteor.subscribe("userPublication");
  if (Meteor.user() && Meteor.user().selectedWardUnitNo) {
    Session.set("selectedWardUnitNo", Meteor.user().selectedWardUnitNo);
  }
};
