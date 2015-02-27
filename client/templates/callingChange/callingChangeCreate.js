Template.callingChangeCreate.events({
  'click input[type=submit]': function(e, instance){
    e.preventDefault();

    $(e.target).addClass('disabled');

    // ------------------------------ Checks ------------------------------ //

    if(!Meteor.user()){
      throwError(i18n.t('You must be logged in.'));
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
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if(error){
          throwError(error.reason);
          clearSeenErrors();
          $(e.target).removeClass('disabled');
          if(error.error == 603)
            Router.go('/callingChangesList/'+error.details);
        }else{
          trackEvent("new calling change", {'callingChangeId': callingChange._id});
          Router.go('/callingChangesList/');
        }
      });
    } else {
      $(e.target).removeClass('disabled');
    }
  }
});
