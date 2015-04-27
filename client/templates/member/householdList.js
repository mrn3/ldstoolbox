var options = {
  //keepHistory: 1000 * 60 * 5,
  //localSearch: true
};
var fields = ['coupleName', "headOfHouse.preferredName", "spouse.preferredName", "children/preferredName"];

householdSearch = new SearchSource("households", fields, options, 5);

function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var theHandle;

Deps.autorun(function() {
  //if it is stake, subscribe to stake one
  if (Session.get("selectedWardUnitNo") == "" || isNaN(Session.get("selectedWardUnitNo"))) {
    theHandle = Meteor.subscribeWithPagination("householdLimitedPublication", "stake", 20);
  } else {
    theHandle = Meteor.subscribeWithPagination("householdLimitedPublication", "ward", 20);
  }
});

Template.householdList.helpers({
  householdSearchInputValue: function() {
    return Session.get("householdSearchInput");
  },
  householdSearchData: function(){
    return householdSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      }
    });
  },
  householdData: function() {
    if (Session.get("householdSearchInput") == "") {
      return householdCollection.find({});
    }
  }
});

Template.householdList.events({
  "keyup #householdSearchInput": _.throttle(function(e) {
    Session.set("householdSearchInput", $("#householdSearchInput").val());
    var text = $(e.target).val().trim();
    householdSearch.search(text);
  }, 200),
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
  Session.set("selectedWardUnitNo", Meteor.user().selectedWardUnitNo);
};
