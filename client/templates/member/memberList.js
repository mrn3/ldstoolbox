function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var theHandle;

Deps.autorun(function() {
  theHandle = Meteor.subscribeWithPagination("wardMemberPublication", 20, Session.get("selectedWardUnitNo"));
});

Template.memberList.helpers({
  memberSearchInputValue: function() {
    return Session.get("memberSearchInput");
  },
  memberData: function() {
    var selector = {};
    var regExp;

    if (Session.get("memberSearchInput")) {
      regExp = buildRegExp(Session.get("memberSearchInput"));

      selector =
        {
          $or: [
            {"preferredName": regExp},
            {"callings.callingName": regExp}
          ]
        };
    }
    return memberCollection.find(selector);
  }
});

Template.memberList.events({
  "keyup #memberSearchInput": function(e, instance){
    Session.set("memberSearchInput", $("#memberSearchInput").val());
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
    //console.log(event.target.scrollTop);
    //console.log(event.target.scrollHeight);
    //console.log(event.target.scrollTop / event.target.scrollHeight);

    //if within 60%, load more
    if ((event.target.scrollTop / event.target.scrollHeight) > 0.4) {
      theHandle.loadNextPage();
    }

    //hide searchbar on scroll down, show on scroll up
    if (event.target.scrollTop < Session.get("previousScrollTop")) {
      $(".mainContentArea").addClass("has-subheader")
      $("#searchBarSubHeader").slideDown();
    } else {
      $(".mainContentArea").removeClass("has-subheader")
      $("#searchBarSubHeader").slideUp();
    }
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
  Session.set("selectedWardUnitNo", Meteor.user().selectedWardUnitNo);
};
