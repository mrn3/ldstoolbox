Template.callingChangeCreate.events({
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
      wardUnitNo:           Meteor.user().wardUnitNo,
      createdAt:            new Date(),
      type:                 Session.get("selectedCallingChangeType"),
      member:               Session.get("selectedCallingChangeMember"),
      calling:              Session.get("selectedCallingChangeCalling"),
      notes:                $('#notes').val(),
      dateDiscussed:        new Date(),
      status:               "Discussed"
    };

    if (properties) {
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if (error) {
          console.log(error.reason);
        } else {
          history.back();
        }
      });
    }
  }
});
