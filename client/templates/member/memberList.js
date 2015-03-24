Template.memberList.events({
  'click [data-action=showSortActionSheet]': function (event, template) {
    IonActionSheet.show({
      buttons: [
        { text: "Households"},
        { text: 'Members' },
      ],
      cancelText: 'Cancel',
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
  }
});
