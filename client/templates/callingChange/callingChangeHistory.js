Template.callingChangeHistory.helpers({
  formatDate: function (inDate, inTime) {
    if (inDate) {
      if (inTime) {
        return moment(inDate + " " + inTime).format("dddd, MMMM D, YYYY, h:mm A");
      } else {
        return moment(inDate).format("dddd, MMMM D, YYYY, h:mm A");
      }
    }
  },
  createdByMember: function () {
    var user = Meteor.users.findOne(this.createdBy);
    return memberCollection.findOne({individualId: user.individualId});
  },
  updatedByMember: function () {
    //return Meteor.users.findOne(this.updatedBy);
    var user = Meteor.users.findOne(this.updatedBy);
    return memberCollection.findOne({individualId: user.individualId});
  }
});
