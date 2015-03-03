Template.meetingFields.helpers({
  memberList: function() {
    return memberCollection.find().fetch().map(function(member){
      if (typeof(member.callings) != "undefined") {
        returnString = member.switchedPreferredName;
        return returnString;
      } else {
        return member.switchedPreferredName;
      }
    });
  },
  callingList: function(){
    Meteor.call("getCallings", function(error, data) {
      if (error) {
        console.log(error);
      }
      Session.set('callingListSession', data);
    });
    if (typeof (Session.get('callingListSession')) !== "undefined") {
      console.log(Session.get('callingListSession'));
      return Session.get('callingListSession')['0'].res;
    } else {
      return false;
    }
  }
});
