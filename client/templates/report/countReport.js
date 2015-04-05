Template.countReport.helpers({
  reportData: function() {
    return memberClientCollection.find({});
  }
});
