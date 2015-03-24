Meteor.methods({
  insertMeeting: function(meeting){
    meeting._id = meetingCollection.insert(meeting);
    return meeting;
  },
  removeMeeting: function(meeting){
    //remove associated data
    announcementCollection.remove({meetingId: meeting._id});
    speakerCollection.remove({meetingId: meeting._id});
    visitorCollection.remove({meetingId: meeting._id});
    recognitionCollection.remove({meetingId: meeting._id});
    //callingChangeCollection.remove({meetingId: meeting._id});
    meetingCollection.remove(meeting._id);
    musicalNumberCollection.remove({meetingId: meeting._id});
    intermediateHymnCollection.remove({meetingId: meeting._id});
  }
});
