function buildRegExp(searchText) {
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

var theHandle;

Deps.autorun(function() {
  theHandle = Meteor.subscribeWithPagination("wardMemberPublication", 20);
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
            {"switchedPreferredName": regExp},
            {"callings.callingName": regExp}
          ]
        };
    }
    //console.log(selector);
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
  "scroll .content": function (event, template) {
    var scrollTop = $("div.content.overflow-scroll.has-header")[0].scrollTop;
    var scrollHeight = $("div.content.overflow-scroll.has-header")[0].scrollHeight;

    //console.log(scrollTop);
    //console.log(scrollHeight);
    //console.log(scrollTop / scrollHeight);

    //if within 60%, load more
    if ((scrollTop / scrollHeight) > 0.4) {
      theHandle.loadNextPage();
    }
  }
});

Template.memberList.rendered = function() {
  if (typeof Session.get("memberSearchInput") == "undefined") {
    Session.set("memberSearchInput", "");
  }
};
