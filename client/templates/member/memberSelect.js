var options = {
  //keepHistory: 1000 * 60 * 5,
  //localSearch: true
};
var fields = ['preferredName', "callings.callingName"];

memberSearch = new SearchSource("members", fields, options, 5);

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

function doUpdate (inUpdateObject) {
  if (Session.get("memberSelectType") == "callingChangeMember") {
    Session.set('selectedCallingChangeMember', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "organist") {
    Session.set('selectedOrganist', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "chorister") {
    Session.set('selectedChorister', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "invocation") {
    Session.set('selectedInvocation', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "benediction") {
    Session.set('selectedBenediction', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "presiding") {
    Session.set('selectedPresiding', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "conducting") {
    Session.set('selectedConducting', inUpdateObject);
  }
  else if (Session.get("memberSelectType") == "visitor") {
    var updateObject = {};
    updateObject.$set = {visitor: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    visitorCollection.update(Session.get("visitorId"), updateObject);
  }
  else if (Session.get("memberSelectType") == "speaker") {
    var updateObject = {};
    updateObject.$set = {speaker: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    speakerCollection.update(Session.get("speakerId"), updateObject);
  }
  else if (Session.get("memberSelectType") == "recognition") {
    //first delete
    var updateObject = {
      $pull:
        {
          "members":
            {
              _id: Session.get("recognitionMemberId")
            }
        }
    }
    recognitionCollection.update(Session.get("recognitionId"), updateObject);
    //then add back
    var updateObject = {
      $addToSet:
        {
          "members": inUpdateObject
        }
    }
    recognitionCollection.update(Session.get("recognitionId"), updateObject);
  }
  else if (Session.get("memberSelectType") == "musicalNumberPerformer") {
    var updateObject = {};
    updateObject.$set = {performer: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
  }
  else if (Session.get("memberSelectType") == "musicalNumberAccompanist") {
    var updateObject = {};
    updateObject.$set = {accompanist: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
  }
  history.back();
}

Template.memberSelect.events({
  "keyup #memberSearchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    memberSearch.search(text);
  }, 200),
  "click #goButton": function() {
    var memberObject = {
      "preferredName": $('#other').val()
    }
    doUpdate(memberObject);
  },
  "click #memberRadioButton": function(e, instance) {
    //strip out html tags
    if (this.preferredName) {
      this.preferredName = jQuery('<p>' + this.preferredName + '</p>').text();
    }
    if (this.callings) {
      this.callings.callingName = jQuery('<p>' + this.callings.callingName + '</p>').text();
    }
    doUpdate(this);
  },
});
