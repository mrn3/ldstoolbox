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
      meetingDate:          $('#meetingDate').val(),
      organist:             $('#organist').val(),
      announcements:        $('#announcements').val()
    };

    if (properties) {
      Meteor.call('insertMeeting', properties, function(error, meeting) {
        if(error) {
          console.log(error.reason);
        } else {
          Router.go("meetingList");
        }
      });
    }
  }
});
