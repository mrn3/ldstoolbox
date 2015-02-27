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
      dateDiscussed:        $('#dateDiscussed').val(),
      dateApproved:         $('#dateApproved').val(),
      dateInterviewed:      $('#dateInterviewed').val(),
      datePresented:        $('#datePresented').val(),
      dateRecorded:         $('#dateRecorded').val(),
      dateSetApart:         $('#dateSetApart').val(),
      dateSetApartRecorded: $('#dateSetApartRecorded').val(),
      dateCancelled:        $('#dateCancelled').val(),
      status:               $('#status').val()
    };

    // ------------------------------ Insert ------------------------------ //

    if (properties) {
      insertObject.$set = properties;
      callingChangeCollection.insert(insertObject, function(error){
        if(error){
          console.log(error);
          $(e.target).removeClass('disabled');
        }else{
          trackEvent("edit calling change", {'callingChangeId': callingChange._id});
          Router.go("/callingChangeList/");
        }
      });
    } else {
      $(e.target).removeClass('disabled');
    }
  }
});
