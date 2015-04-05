Template.countReportInner.helpers({
  stakeMemberCount: function() {
    return memberCollection.find({stakeUnitNo: Meteor.user().stakeUnitNo}).count();
  },
  wardMemberCount: function() {
    return memberCollection.find({wardUnitNo: Meteor.user().wardUnitNo}).count();
  },
  stakeHouseholdCount: function() {
    return householdCollection.find({stakeUnitNo: Meteor.user().stakeUnitNo}).count();
  },
  wardHouseholdCount: function() {
    return householdCollection.find({wardUnitNo: Meteor.user().wardUnitNo}).count();
  },
  stakeCallingCount: function() {
    return callingCollection.find({stakeUnitNo: Meteor.user().stakeUnitNo}).count();
  },
  wardCallingCount: function() {
    return callingCollection.find({wardUnitNo: Meteor.user().wardUnitNo}).count();
  }
});
