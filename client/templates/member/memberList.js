var options = {
  //keepHistory: 1000 * 60 * 5,
  //localSearch: true
};
var fields = ['preferredName', "callings.positionName"];

memberSearch = new SearchSource("members", fields, options, 5);

function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var theHandle;

Deps.autorun(function() {
  //if it is stake, subscribe to stake one
  if (Session.get("selectedWardUnitNo") == "" || isNaN(Session.get("selectedWardUnitNo"))) {
    theHandle = Meteor.subscribeWithPagination("memberLimitedPublication", "stake", 20);
  } else {
    theHandle = Meteor.subscribeWithPagination("memberLimitedPublication", "ward", 20);
  }
});

Template.memberList.helpers({
  memberSearchInputValue: function() {
    return Session.get("memberSearchInput");
  },
  memberSearchData: function(){
    return memberSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      }
    });
  },
  memberData: function() {
    if (Session.get("memberSearchInput") == "") {
      return memberCollection.find({});
    }
  }
});

Template.memberList.events({
  "keyup #memberSearchInput": _.throttle(function(e) {
    Session.set("memberSearchInput", $("#memberSearchInput").val());
    var text = $(e.target).val().trim();
    memberSearch.search(text);
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
    //make sure it has been scrolled two times to prevent bouncing
    if ((Session.get("previousScrollTop") < Session.get("previous2ScrollTop"))
      && (event.target.scrollTop < Session.get("previousScrollTop"))) {
      //scrolling up - show searchbar
      $(".mainContentArea").addClass("has-subheader")
      $("#searchBarSubHeader").slideDown();
    } else {
      //scrolling down - hide searchbar and load more results
      $(".mainContentArea").removeClass("has-subheader")
      $("#searchBarSubHeader").slideUp();
      theHandle.loadNextPage();
    }
    Session.set("previous2ScrollTop", Session.get("previousScrollTop"));
    Session.set("previousScrollTop", event.target.scrollTop);
  }
});

Template.memberList.rendered = function() {
  if (typeof Session.get("memberSearchInput") == "undefined") {
    Session.set("memberSearchInput", "");
  }
  if (typeof Session.get("previousScrollTop") == "undefined") {
    Session.set("previousScrollTop", 0);
  }
  if (typeof Session.get("previous2ScrollTop") == "undefined") {
    Session.set("previous2ScrollTop", 0);
  }
  Session.set("selectedWardUnitNo", Meteor.user().selectedWardUnitNo);
};
