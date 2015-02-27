Template.callingChangeEdit.events({
  "click #cancelCallingChangeButton": function(e, instance){
    if (confirm("Are you sure you want to cancel this calling change?")) {
      var callingChange = this;
      var updateObject = {};

      e.preventDefault();

      $(e.target).addClass('disabled');

      // ------------------------------ Checks ------------------------------ //

      if(!Meteor.user()){
        throwError(i18n.t('You must be logged in.'));
        return false;
      }

      // Basic Properties
      var properties = {
        dateCancelled:        moment().tz('Etc/GMT').format('YYYY-MM-DD'),
        status:               "Cancelled"
      };

      // ------------------------------ Update ------------------------------ //

      if (properties) {

        updateObject.$set = properties;

        callingChangesCollection.update(callingChange._id, updateObject, function(error){
          if(error){
            console.log(error);
            throwError(error.message);
            clearSeenErrors();
            $(e.target).removeClass('disabled');
          }else{
            trackEvent("edit calling change", {'callingChangeId': callingChange._id});
            Router.go("/callingChangesList/");
          }
        });
      } else {
        $(e.target).removeClass('disabled');
      }
    }
  },
  "click input[type=submit]": function(e, instance){
    var callingChange = this;
    var updateObject = {};

    e.preventDefault();

    $(e.target).addClass('disabled');

    // ------------------------------ Checks ------------------------------ //

    if(!Meteor.user()){
      throwError(i18n.t('You must be logged in.'));
      return false;
    }

    // Basic Properties
    var properties = {
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

    // ------------------------------ Update ------------------------------ //

    if (properties) {

      updateObject.$set = properties;

      callingChangesCollection.update(callingChange._id, updateObject, function(error){
        if(error){
          console.log(error);
          throwError(error.message);
          clearSeenErrors();
          $(e.target).removeClass('disabled');
        }else{
          trackEvent("edit calling change", {'callingChangeId': callingChange._id});
          Router.go("/callingChangesList/");
        }
      });
    } else {
      $(e.target).removeClass('disabled');
    }
  }
});
