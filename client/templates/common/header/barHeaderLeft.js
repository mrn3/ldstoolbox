Template.barHeaderLeft.helpers({
  isEqual: function(inValue1, inValue2) {
    return (inValue1 == inValue2);
  }
});
Template.barHeaderLeft.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "click #backButton": function(e, instance) {
    history.back();
  }
});
