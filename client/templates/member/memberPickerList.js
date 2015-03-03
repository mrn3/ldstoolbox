var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['switchedPreferredName'];

memberSearch = new SearchSource('members', fields, options);

Template.memberPickerList.helpers({
  memberData: function(){
    return memberSearch.getData({
      transform: function(matchText, regExp) {
        //return matchText.replace(regExp, "<b>$&</b>")
        return matchText.replace(regExp, "$&")
      },
      sort: {isoScore: -1}
    });
  },
  isLoading: function() {
    return memberSearch.getStatus().loading;
  }
});

Template.memberPickerList.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    memberSearch.search(text);
  }, 200),
  "click #memberRadioButton": function(e, instance) {
    //console.log(this.switchedPreferredName);
    Session.set('selectedMember', this);
    history.back();
  },
});

Template.memberPickerList.rendered = function() {
  $('#searchInput').focus();
};
