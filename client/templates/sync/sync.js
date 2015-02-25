Template.sync.events({
  'click #syncAllButton': function(e){
    e.preventDefault();

    $("#syncAllButton").prop('disabled', true);
    $("#syncAllButton").val("Syncing, please wait...");

    if ($("#ldsAccountUsername").val() == "" || $("#ldsAccountPassword").val() == "") {
      alert("LDS Account username and password are required in order to synchronize members.");

      $("#syncAllButton").prop('disabled', false);
      $("#syncAllButton").val("Sync");
      return false;
    }

    Meteor.call("syncMembers", $("#ldsAccountUsername").val(), $("#ldsAccountPassword").val(), function(error) {
      if (error) {
        console.log(error);
      } else {
        //throwError('All members in this unit have been synchronized.');
      }
      $("#syncAllButton").prop('disabled', false);
      $("#syncAllButton").val("Sync");
    });

  }
});
