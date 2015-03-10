Template.recognitionTypeSelect.helpers({
  isChecked: function (type) {
    if (type == Session.get("selectedRecognitionType")) {
      return "checked";
    } else {
      return "";
    }
  }
});

Template.recognitionTypeSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "click #recognitionTypeItem": function(e, instance) {
    var updateObject = {};
    updateObject.$set = {recognitionType: this};
    recognitionCollection.update(Session.get("recognitionId"), updateObject);

    history.back();
  }
});
