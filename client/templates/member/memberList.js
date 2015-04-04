var theHandle;

Deps.autorun(function() {
  theHandle = Meteor.subscribeWithPagination("wardMemberPublication", 20);
});

Template.memberList.events({
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

    //wconsole.log(scrollTop);
    //console.log(scrollHeight);
    //console.log(scrollTop / scrollHeight);

    //if within 60%, load more
    if ((scrollTop / scrollHeight) > 0.4) {
      theHandle.loadNextPage();
    }
  }
});
