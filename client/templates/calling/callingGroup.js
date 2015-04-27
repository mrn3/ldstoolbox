Template.callingGroup.helpers({
  getMemberName: function(inIndividualId) {
    if (inIndividualId) {
      member = memberCollection.findOne({individualId: inIndividualId});
      if (member && member.preferredName) {
        return member.preferredName;
      }
    }
  },
  formatDate: function(inDate) {
    return moment(inDate).format("MM/DD/YY");
  }
});
