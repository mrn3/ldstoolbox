Template.callingChangeEdit.events({
  'click #editButton': function(e, instance) {
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
      memberName:           $('#memberName').val(),
      callingName:          $('#callingName').val(),
      notes:                $('#notes').val(),
      dateDiscussed:        new Date(),
      status:               "Discussed"
    };

    if (properties) {
      updateObject.$set = properties;
      callingChangesCollection.update(callingChange._id, updateObject, function(error){
        if(error){
          console.log(error);
        } else {
          Router.go("callingChangeList");
        }
      });
    }
  }
});
