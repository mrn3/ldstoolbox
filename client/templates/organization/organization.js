Template.organization.events({
  "click [data-action=showOrganizationActionSheet]": function (event, template) {
    //console.log(template);
    var individualIdArray = template.data.memberData.fetch().map(function(obj) { return obj.individualId; });
    var selector =
      {
        $or: [
          {"headOfHousehold.individualId": {$in: individualIdArray}},
          {"headOfHouse.individualId": {$in: individualIdArray}},
          {"spouse.individualId": {$in: individualIdArray}},
          {"otherHouseholdMembers.individualId": {$in: individualIdArray}}
        ]
      };
    var householdArray = householdCollection.find(selector).fetch();

    IonActionSheet.show({
      buttons: [
        { text: "View Members on Map"}
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Session.set("householdArray", householdArray);
          Router.go("/organizationMap/" + template.data.organizationData._id);
        }
        return true;
      }
    });
  }
});
