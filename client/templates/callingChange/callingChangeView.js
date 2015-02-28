Template.callingChangeView.events({
  'click [data-action=showActionSheet]': function(e, instance){
    var callingChange = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [

      ],
      destructiveText: 'Delete',
      cancelText: 'Cancel',
      cancel: function() {
      },
      destructiveButtonClicked: function() {
        callingChangeCollection.remove(callingChange._id);
        Router.go("callingChangeList");
        return true;
      }
    });
  }
});
