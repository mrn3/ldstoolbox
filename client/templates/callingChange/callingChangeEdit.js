Template.callingChangeEdit.events({
  'click #editButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      updatedBy:            Meteor.userId(),
      updatedAt:            new Date(),
      type:                 $('#type').val(),
      memberName:           $('#memberName').val(),
      callingName:          $('#callingName').val(),
      notes:                $('#notes').val()
    };

    if (properties) {
      Meteor.call('updateCallingChange', callingChange._id, properties, function(error, callingChange) {
        if(error) {
          console.log(error.reason);
        } else {
          Router.go("callingChangeList");
        }
      });
    }
  }
});
