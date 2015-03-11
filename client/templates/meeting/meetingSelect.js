Template.meetingSelect.helpers({
  isChecked: function (type) {
    if (type == Session.get("selectedRecognitionType")) {
      return "checked";
    } else {
      return "";
    }
  }
});

Template.meetingSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "click #meetingItem": function(e, instance) {
    var updateObject = {};
    updateObject.$set = {meeting: this};
    callingChangeCollection.update(Session.get("meetingId"), updateObject);

    history.back();
  }
});
