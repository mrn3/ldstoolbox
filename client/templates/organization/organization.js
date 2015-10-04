Template.organization.helpers({
  memberCount: function () {
    return this.memberData.count();
  }
});

Template.organization.events({
  "click [data-action=showOrganizationActionSheet]": function (event, template) {
    var memberArray = template.data.memberData.fetch()
    var individualIdArray = memberArray.map(function(obj) { return obj.individualId; });
    var selector =
      {
        $or: [
          {"headOfHouse.individualId": {$in: individualIdArray}},
          {"spouse.individualId": {$in: individualIdArray}},
          {"children.individualId": {$in: individualIdArray}}
        ]
      };
    var householdArray = householdCollection.find(selector).fetch();

    IonActionSheet.show({
      buttons: [
        { text: "Email Members" },
        { text: "View Members on Map" }
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          var emailArray = memberArray.map(function(obj) { return obj.email });
          var emailString = "mailto:" + emailArray.join(",")
          window.location = emailString;
        } else if (index === 1) {
          Session.set("individualIdArray", individualIdArray);
          Session.set("householdArray", householdArray);
          Router.go("/organizationMap/" + template.data.organizationData._id);
        }
        return true;
      }
    });
  }
});
