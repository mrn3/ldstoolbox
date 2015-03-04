Template.callingChangeTypePickerList.helpers({
  isChecked: function (type) {
    if (type == Session.get("selectedCallingChangeType")) {
      return "checked";
    } else {
      return "";
    }
  }
});

Template.callingChangeTypePickerList.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "click #callingRadioButtonCall": function(e, instance) {
    Session.set('selectedCallingChangeType', "Call");
    history.back();
  },
  "click #callingRadioButtonRelease": function(e, instance) {
    Session.set('selectedCallingChangeType', "Release");
    history.back();
  }
});
