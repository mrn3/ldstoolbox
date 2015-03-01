Template.meetingEdit.events({
  'click #editButton': function(e, instance) {
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
      updateObject.$set = properties;
      meetingsCollection.update(meeting._id, updateObject, function(error){
        if(error){
          console.log(error);
        } else {
          Router.go("meetingList");
        }
      });
    }
  }
});
