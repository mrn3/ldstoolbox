function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var theHandle;

Deps.autorun(function() {
  theHandle = Meteor.subscribeWithPagination("wardLimitedHouseholdPublication", 20);
});

Template.householdList.helpers({
  householdSearchInputValue: function() {
    return Session.get("householdSearchInput");
  },
  householdData: function() {
    var selector = {};
    var regExp;

    if (Session.get("householdSearchInput")) {
      regExp = buildRegExp(Session.get("householdSearchInput"));

      selector =
        {
          $or: [
            {"coupleName": regExp},
            {"headOfHousehold.name": regExp},
            {"spouse.name": regExp},
            {"otherHouseholdMembers.name": regExp}
          ]
        };
    }
    return householdCollection.find(selector);
  }
});

Template.householdList.events({
  "keyup #householdSearchInput": function(e, instance){
    Session.set("householdSearchInput", $("#householdSearchInput").val());
  },
  "click [data-action=showSortActionSheet]": function (event, template) {
    IonActionSheet.show({
      buttons: [
        { text: "Households"},
        { text: "Members" },
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          Router.go("householdList");
        }
        if (index === 1) {
          Router.go("memberList");
        }
        return true;
      }
    });
  },
  "scroll .mainContentArea": function (event, template) {
    if (event.target.scrollTop < Session.get("previousScrollTop")) {
      //scrolling up - show searchbar
      $(".mainContentArea").addClass("has-subheader")
      $("#searchBarSubHeader").slideDown();
    } else {
      //scrolling down - hide searchbar and load more results
      $(".mainContentArea").removeClass("has-subheader")
      $("#searchBarSubHeader").slideUp();
      theHandle.loadNextPage();
    }
    Session.set("previousScrollTop", event.target.scrollTop);
  }
});

Template.householdList.rendered = function() {
  if (typeof Session.get("householdSearchInput") == "undefined") {
    Session.set("householdSearchInput", "");
  }
  if (typeof Session.get("previousScrollTop") == "undefined") {
    Session.set("previousScrollTop", 0);
  }
};
