Template.countReport.helpers({
  reportData: function() {
    return memberClientCollection.find({});
  },
  getWardName: function(inWardUnitNo) {
    unit = unitCollection.findOne({wardUnitNo: inWardUnitNo});
    return unit.wardName;
  }
});
