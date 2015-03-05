var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['switchedPreferredName', "callings.callingName"];

memberSearch = new SearchSource('members', fields, options);

Template.memberSelect.helpers({
  memberData: function(){
    return memberSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      },
      sort: {isoScore: -1}
    });
  },
  isLoading: function() {
    return memberSearch.getStatus().loading;
  }
});

Template.memberSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    memberSearch.search(text);
  }, 200),
  "click #memberRadioButton": function(e, instance) {
    //strip out html tags
    this.switchedPreferredName = jQuery('<p>' + this.switchedPreferredName + '</p>').text();
    this.callings.callingName = jQuery('<p>' + this.callings.callingName + '</p>').text();

    Session.set('selectedMember', this);
    history.back();
  },
});

/*
Template.memberSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
