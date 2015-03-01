Template.callingChangeEdit.events({
  'click #editButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;
    var updateObject = {};

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
      updateObject.$set = properties;
      console.log(updateObject);
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error){
          console.log(error);
        } else {
          Router.go("callingChangeList");
        }
      });
    }
  }
});
