Template.callingChangeCreate.events({
  'click #cancelButton': function(e, instance) {
    history.back();
  },
  'click #doneButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      type:                 $('#type').val(),
      member:               Session.get("selectedMember"),
      calling:              Session.get("selectedCalling"),
      notes:                $('#notes').val(),
      dateDiscussed:        new Date(),
      status:               "Discussed"
    };

    if (properties) {
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if(error) {
          console.log(error.reason);
        } else {
          Router.go("callingChangeList");
        }
      });
    }
  }
});
