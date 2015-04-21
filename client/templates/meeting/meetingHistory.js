Template.meetingHistory.helpers({
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
    if (this.createdBy) {
      var user = Meteor.users.findOne(this.createdBy);
      return memberCollection.findOne({individualId: user.individualId});
    }
  },
  updatedByMember: function () {
    if (this.updatedBy) {
      var user = Meteor.users.findOne(this.updatedBy);
      return memberCollection.findOne({individualId: user.individualId});
    }
  }
});
