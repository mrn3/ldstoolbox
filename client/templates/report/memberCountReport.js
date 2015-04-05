Template.memberCountReport.helpers({
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
  reportData: function() {
    return memberClientCollection.find();
  }
});
