Template.signupList.helpers({
  formattedSignupDate: function() {
    return moment(this.signupDate).format("dddd, MMMM D, YYYY");
  }
});

Template.signupList.events({
  'click #createSignupButton': function(e, instance) {
    e.preventDefault();

    var signup = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo
    };

    if (properties) {
      Meteor.call('insertSignup', properties, function(error, signup) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go("/signupEdit/" + signup._id);
        }
      });
    }
  }
});

Template.signupList.rendered = function() {
  Session.set("memberSelectType", "");

  Session.set("selectedResponsible", "");
  Session.set("memberSelectId", "");
};
