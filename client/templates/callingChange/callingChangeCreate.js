Template.callingChangeCreate.events({
  'click input[type=submit]': function(e, instance){
    e.preventDefault();

    var callingChange = this;
    var insertObject = {};

    $(e.target).addClass('disabled');

    // ------------------------------ Checks ------------------------------ //

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    // Basic Properties
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

    // ------------------------------ Insert ------------------------------ //

    if (properties) {
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if(error){
          console.log(error.reason);
          $(e.target).removeClass('disabled');
        }else{
          $(e.target).removeClass('disabled');
        }
      });
    } else {
      $(e.target).removeClass('disabled');
    }
  }
});
