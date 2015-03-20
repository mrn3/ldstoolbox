Template.sync.helpers({
  user: function() {
    return Meteor.user();
  },
  ldsAccountUserNotAuthenticated: function() {
    if (Meteor.user() && Meteor.user().ldsAccount && Meteor.user().ldsAccount.updatedAt) {
      var oneHourAgo = moment().subtract(1, "hours");
      return oneHourAgo.isAfter(Meteor.user().ldsAccount.updatedAt);
    } else {
      return true;
    }
  },
  wardMemberCount: function() {
    return memberCollection.find({wardUnitNo: Meteor.user().wardUnitNo}).count();
  },
  wardCallingCount: function() {
    return callingCollection.find({wardUnitNo: Meteor.user().wardUnitNo}).count();
  },
  stakeMemberCount: function() {
    return memberCollection.find({stakeUnitNo: Meteor.user().stakeUnitNo}).count();
  },
  stakeCallingCount: function() {
    return callingCollection.find({stakeUnitNo: Meteor.user().stakeUnitNo}).count();
  }
});

Template.sync.events({
  'click #authenticateLdsAccountUserButton': function(e){
    e.preventDefault();

    $("#authenticateLdsAccountUserButton").prop('disabled', true);
    $("#authenticateLdsAccountUserButton").val("Authenticating, please wait...");

    if ($("#ldsAccountUsername").val() == "" || $("#ldsAccountPassword").val() == "") {
      alert("LDS Account username and password are required.");

      $("#authenticateLdsAccountUserButton").prop('disabled', false);
      $("#authenticateLdsAccountUserButton").val("Authenticate");
      return false;
    }

    Meteor.call("authenticateLdsAccountUser", $("#ldsAccountUsername").val(), $("#ldsAccountPassword").val(), function(error) {
      if (error) {
        console.log(error);
      }
      $("#authenticateLdsAccountUserButton").prop('disabled', false);
      $("#authenticateLdsAccountUserButton").val("Authenticate");
    });
  },
  'click #syncWardButton': function(e){
    e.preventDefault();

    $("#syncWardButton").prop('disabled', true);
    $("#syncWardButton").val("Syncing Ward, please wait...");

    Meteor.call("syncWard", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncWardButton").prop('disabled', false);
      $("#syncWardButton").val("Sync Ward");
    });
  },
  'click #syncStakeButton': function(e){
    e.preventDefault();

    $("#syncStakeButton").prop('disabled', true);
    $("#syncStakeButton").val("Syncing Stake, please wait...");

    Meteor.call("syncStake", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncStakeButton").prop('disabled', false);
      $("#syncStakeButton").val("Sync Stake");
    });
  }
});
