Template.meetingCreate.events({
  'click #createButton': function(e, instance) {
    e.preventDefault();

    var meeting = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      type:                 $('#type').val(),
      memberName:           $('#memberName').val(),
      callingName:          $('#callingName').val(),
      notes:                $('#notes').val(),
      dateDiscussed:        new Date(),
      status:               "Discussed"
    };

    if (properties) {
      Meteor.call('insertmeeting', properties, function(error, meeting) {
        if(error) {
          console.log(error.reason);
        } else {
          Router.go("meetingList");
        }
      });
    }
  }
});
