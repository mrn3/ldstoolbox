Template.sync.events({
  'click #authenticateMemberButton': function(e){
    e.preventDefault();

    $("#authenticateMemberButton").prop('disabled', true);
    $("#authenticateMemberButton").val("Authenticating, please wait...");

    if ($("#ldsAccountUsername").val() == "" || $("#ldsAccountPassword").val() == "") {
      alert("LDS Account username and password are required.");

      $("#authenticateMemberButton").prop('disabled', false);
      $("#authenticateMemberButton").val("Authenticate Member");
      return false;
    }

    Meteor.call("authenticateMember", $("#ldsAccountUsername").val(), $("#ldsAccountPassword").val(), function(error) {
      if (error) {
        console.log(error);
      }
      $("#authenticateMemberButton").prop('disabled', false);
      $("#authenticateMemberButton").val("Authenticate Member");
    });
  },
  'click #syncUnitsButton': function(e){
    e.preventDefault();

    $("#syncUnitsButton").prop('disabled', true);
    $("#syncUnitsButton").val("Syncing Units, please wait...");

    Meteor.call("syncUnits", function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncUnitsButton").prop('disabled', false);
      $("#syncUnitsButton").val("Sync Units");
    });
  },
  'click #syncWardMembersButton': function(e){
    e.preventDefault();

    $("#syncWardMembersButton").prop('disabled', true);
    $("#syncWardMembersButton").val("Syncing Ward Members, please wait...");

    Meteor.call("syncWardMembers", Meteor.user().wardUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncWardMembersButton").prop('disabled', false);
      $("#syncWardMembersButton").val("Sync Ward Members");
    });
  },
  'click #syncStakeMembersButton': function(e){
    e.preventDefault();

    $("#syncStakeMembersButton").prop('disabled', true);
    $("#syncStakeMembersButton").val("Syncing Stake Members, please wait...");
    //console.log(Meteor.user().stakeUnitNo);

    Meteor.call("syncStakeMembers", Meteor.user().stakeUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncStakeMembersButton").prop('disabled', false);
      $("#syncStakeMembersButton").val("Sync Stake Members");
    });
  },
  'click #syncWardCallingsButton': function(e){
    e.preventDefault();

    $("#syncWardCallingsButton").prop('disabled', true);
    $("#syncWardCallingsButton").val("Syncing Ward Callings, please wait...");

    Meteor.call("syncWardCallings", Meteor.user().wardUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncWardCallingsButton").prop('disabled', false);
      $("#syncWardCallingsButton").val("Sync Ward Callings");
    });
  },
  'click #syncStakeCallingsButton': function(e){
    e.preventDefault();

    $("#syncStakeCallingsButton").prop('disabled', true);
    $("#syncStakeCallingsButton").val("Syncing Stake Callings, please wait...");
    //console.log(Meteor.user().stakeUnitNo);

    Meteor.call("syncStakeCallings", Meteor.user().stakeUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
      $("#syncStakeCallingsButton").prop('disabled', false);
      $("#syncStakeCallingsButton").val("Sync Stake Callings");
    });
  },


});
