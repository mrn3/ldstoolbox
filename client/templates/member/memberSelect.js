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
  },
  memberSelectTypeIs: function (inMemberSelectType) {
    return (Session.get("memberSelectType") == inMemberSelectType);
  },
  /*
  organistData: function() {
    console.log(memberCollection.find().fetch());
    Meteor.subscribe('memberPublication', function() {
      console.log(memberCollection.find().count());
    });
    return memberCollection.find();
  },
  */
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
    if (this.switchedPreferredName) {
      this.switchedPreferredName = jQuery('<p>' + this.switchedPreferredName + '</p>').text();
    }
    if (this.callings) {
      this.callings.callingName = jQuery('<p>' + this.callings.callingName + '</p>').text();
    }

    //console.log(Session.get("memberSelectType"));
    if (Session.get("memberSelectType") == "callingChangeMember") {
      Session.set('selectedCallingChangeMember', this);
    }
    else if (Session.get("memberSelectType") == "organist") {
      Session.set('selectedOrganist', this);
    }
    else if (Session.get("memberSelectType") == "chorister") {
      Session.set('selectedChorister', this);
    }
    else if (Session.get("memberSelectType") == "invocation") {
      Session.set('selectedInvocation', this);
    }
    else if (Session.get("memberSelectType") == "benediction") {
      Session.set('selectedBenediction', this);
    }
    else if (Session.get("memberSelectType") == "presiding") {
      Session.set('selectedPresiding', this);
    }
    else if (Session.get("memberSelectType") == "conducting") {
      Session.set('selectedConducting', this);
    }
    else if (Session.get("memberSelectType") == "visitingAuthority") {
      Session.set('selectedVisitingAuthority', this);
    }
    else if (Session.get("memberSelectType") == "speaker") {
      var updateObject = {};
      updateObject.$set = {speaker: this, wardUnitNo: Meteor.user().wardUnitNo};
      speakerCollection.update(Session.get("speakerId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "recognition") {
      var updateObject = {};
      updateObject.$set = {member: this, wardUnitNo: Meteor.user().wardUnitNo};
      recognitionCollection.update(Session.get("recognitionId"), updateObject);
    }

    history.back();
  },
});

/*
Template.memberSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
