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
  },
  reportData: function() {
    return memberClientCollection.find();
  }
});
