Template.callingChangeTypeSelect.helpers({
  isChecked: function (type) {
    if (type == Session.get("selectedCallingChangeType")) {
      return "checked";
    } else {
      return "";
    }
  }
});

Template.callingChangeTypeSelect.events({
  "click #callingRadioButtonCall": function(e, instance) {
    Session.set('selectedCallingChangeType', "Call");
    history.back();
  },
  "click #callingRadioButtonRelease": function(e, instance) {
    Session.set('selectedCallingChangeType', "Release");
    history.back();
  }
});
