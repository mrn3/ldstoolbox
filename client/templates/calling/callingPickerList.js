var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['leaders.callingName'];

callingSearch = new SearchSource('callings', fields, options);

Template.callingPickerList.helpers({
  callingData: function(){
    return callingSearch.getData({
      transform: function(matchText, regExp) {
        //return matchText.replace(regExp, "<b>$&</b>")
        return matchText.replace(regExp, "$&")
      },
      sort: {isoScore: -1}
    });
  },
  isLoading: function() {
    return callingSearch.getStatus().loading;
  }
});

Template.callingPickerList.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    callingSearch.search(text);
  }, 200),
  /*
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    Meteor.call("getCallings", function(error, data) {
      if (error) {
        console.log(error);
      }
      console.log(data);
    });
    //callingSearch.search(text);
  }, 200),
  */
  "click #callingRadioButton": function(e, instance) {
    //console.log(this.switchedPreferredName);
    Session.set('selectedCalling', this);
    history.back();
  },
});

Template.callingPickerList.rendered = function() {
  $('#searchInput').focus();
};
