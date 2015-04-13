Template.sync.helpers({
  userData: function() {
    return Meteor.user();
  },
  ldsAccountUserNotAuthenticated: function() {
    if (Meteor.user()
      && Meteor.user().ldsAccount
      && Meteor.user().ldsAccount.updatedAt
      && Meteor.user().ldsAccount.cookieValue
      && Meteor.user().ldsAccount.statusCode == 200) {
      var oneHourAgo = moment().subtract(1, "hours");
      return oneHourAgo.isAfter(Meteor.user().ldsAccount.updatedAt);
    } else {
      return true;
    }
  }
});

Template.sync.events({
  'click #signInLdsAccountUserButton': function(e){
    e.preventDefault();

    $("#signInLdsAccountUserButton").prop('disabled', true);
    $("#signInLdsAccountUserButton").val("Signing In, please wait...");

    if ($("#ldsAccountUsername").val() == "" || $("#ldsAccountPassword").val() == "") {

      IonPopup.alert({
        title: "Sign In Error",
        template: "LDS Account username and password are required.",
        okText: "Okay"
      });

      $("#signInLdsAccountUserButton").prop('disabled', false);
      $("#signInLdsAccountUserButton").val("Sign In");
      return false;
    }

    Meteor.call("signInLdsAccountUser", $("#ldsAccountUsername").val(), $("#ldsAccountPassword").val(), function(error) {
      if (error) {
        console.log(error);
      }

      if (Meteor.user().ldsAccount.statusCode != 200) {
        IonPopup.alert({
          title: "Sign In Error",
          template: "There was an error signing in to your LDS Account. Please make sure you have the correct username and password. You may also need to visit <a target='_blank' href='https://ldsaccount.lds.org/'>https://ldsaccount.lds.org/</a>.",
          okText: "Okay"
        });
      }

      $("#signInLdsAccountUserButton").prop('disabled', false);
      $("#signInLdsAccountUserButton").val("Sign In");
    });
  },
  'click #signOutLdsAccountUserButton': function(e){
    e.preventDefault();

    $("#signOutLdsAccountUserButton").prop('disabled', true);
    $("#signOutLdsAccountUserButton").val("Signing Out, please wait...");

    Meteor.call("signOutLdsAccountUser", function(error) {
      if (error) {
        console.log(error);
      }
      $("#signOutLdsAccountUserButton").prop('disabled', false);
      $("#signOutLdsAccountUserButton").val("Sign Out");
    });
  },
  'click #syncMyInfoButton': function(e){
    e.preventDefault();

    $("#syncMyInfoButton").prop('disabled', true);
    $("#syncMyInfoButton").val("Syncing My Information, please wait...");

    Meteor.call("syncMyInfo", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncMyInfoButton").prop('disabled', false);
      $("#syncMyInfoButton").val("Sync My Information");
    });
  },
  'click #syncWardButton': function(e){
    e.preventDefault();

    $("#syncWardButton").prop('disabled', true);
    $("#syncWardButton").val("Syncing Ward Information, please wait...");

    Meteor.call("syncWard", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncWardButton").prop('disabled', false);
      $("#syncWardButton").val("Sync Ward Information");
    });
  },
  'click #syncStakeButton': function(e){
    e.preventDefault();

    $("#syncStakeButton").prop('disabled', true);
    $("#syncStakeButton").val("Syncing Stake Information, please wait...");

    Meteor.call("syncStake", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncStakeButton").prop('disabled', false);
      $("#syncStakeButton").val("Sync Stake Information");
    });
  }
});
