Template.member.rendered = function() {
  if (this.data
    && this.data.householdData
    && this.data.householdData.headOfHousehold
    && this.data.householdData.headOfHousehold.indiviualId)
  Meteor.call("getHousehold", parseInt(this.data.householdData.headOfHousehold.indiviualId), function(error) {
    if (error) {
      console.log(error);
    }
  });
}
