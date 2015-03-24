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
  isLikelyOptions: function () {
    return (
      (Session.get("memberSelectType") == "organist") ||
      (Session.get("memberSelectType") == "chorister") ||
      (Session.get("memberSelectType") == "presiding") ||
      (Session.get("memberSelectType") == "conducting") ||
      (Session.get("memberSelectType") == "visitor")
    );
  },
  memberSelectTypeIs: function (inMemberSelectType) {
    return (Session.get("memberSelectType") == inMemberSelectType);
  },
  organistData: function() {
    //get Organist or Pianist position
    return memberCollection.find({"callings.positionId": 234, "wardUnitNo": Meteor.user().wardUnitNo});
  },
  choristerData: function() {
    //get Chorister position
    return memberCollection.find({"callings.positionId": 1585, "wardUnitNo": Meteor.user().wardUnitNo});
  },
  presidingData: function() {
    //get Presiding position - Stake Presidency, Bishopric
    var selector = {$or: [
      {"callings.positionId": {$in: [4, 54, 55]}, "wardUnitNo": Meteor.user().wardUnitNo},
      {"callings.positionId": {$in: [1, 2, 3]}, "stakeUnitNo": Meteor.user().stakeUnitNo}
    ]};
    var options = {sort: {"callings.positionId": 1}};
    return memberCollection.find(selector, options);
  },
  conductingData: function() {
    //get Presiding position - Bishopric
    var selector = {$or: [
      {"callings.positionId": {$in: [4, 54, 55]}, "wardUnitNo": Meteor.user().wardUnitNo}
    ]};
    var options = {sort: {"callings.positionId": 1}};
    return memberCollection.find(selector, options);
  },
  visitorData: function() {
    //get Visiting Authority position - Stake Presidency, High Council
    var selector = {$or: [
      {"callings.positionId": {$in: [1, 2, 3, 94]}, "stakeUnitNo": Meteor.user().stakeUnitNo}
    ]};
    var options = {sort: {"callings.positionId": 1}};
    return memberCollection.find(selector, options);
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

  "click #goButton": function() {
    var memberObject = {
      "switchedPreferredName": $('#other').val()
    }
    if (Session.get("memberSelectType") == "callingChangeMember") {
      Session.set('selectedCallingChangeMember', memberObject);
    }
    else if (Session.get("memberSelectType") == "organist") {
      Session.set('selectedOrganist', memberObject);
    }
    else if (Session.get("memberSelectType") == "chorister") {
      Session.set('selectedChorister', memberObject);
    }
    else if (Session.get("memberSelectType") == "invocation") {
      Session.set('selectedInvocation', memberObject);
    }
    else if (Session.get("memberSelectType") == "benediction") {
      Session.set('selectedBenediction', memberObject);
    }
    else if (Session.get("memberSelectType") == "presiding") {
      Session.set('selectedPresiding', memberObject);
    }
    else if (Session.get("memberSelectType") == "conducting") {
      Session.set('selectedConducting', memberObject);
    }
    else if (Session.get("memberSelectType") == "visitor") {
      var updateObject = {};
      updateObject.$set = {visitor: memberObject};
      visitorCollection.update(Session.get("visitorId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "speaker") {
      var updateObject = {};
      updateObject.$set = {speaker: memberObject};
      speakerCollection.update(Session.get("speakerId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "recognition") {
      var updateObject = {};
      updateObject.$set = {member: memberObject};
      recognitionCollection.update(Session.get("recognitionId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "musicalNumberPerformer") {
      var updateObject = {};
      updateObject.$set = {performer: memberObject, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "musicalNumberAccompanist") {
      var updateObject = {};
      updateObject.$set = {accompanist: memberObject, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }
    history.back();
  },
  "click #memberRadioButton": function(e, instance) {
    //strip out html tags
    if (this.switchedPreferredName) {
      this.switchedPreferredName = jQuery('<p>' + this.switchedPreferredName + '</p>').text();
    }
    if (this.callings) {
      this.callings.callingName = jQuery('<p>' + this.callings.callingName + '</p>').text();
    }
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
    else if (Session.get("memberSelectType") == "visitor") {
      var updateObject = {};
      updateObject.$set = {visitor: this, wardUnitNo: Meteor.user().wardUnitNo};
      visitorCollection.update(Session.get("visitorId"), updateObject);
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
    else if (Session.get("memberSelectType") == "musicalNumberPerformer") {
      var updateObject = {};
      updateObject.$set = {performer: this, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }
    else if (Session.get("memberSelectType") == "musicalNumberAccompanist") {
      var updateObject = {};
      updateObject.$set = {accompanist: this, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }

    history.back();
  },
});

/*
Template.memberSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
