Router.configure({
  layoutTemplate: "layout"
});

Meteor.startup(function () {
  if (Meteor.isClient) {
    var location = Iron.Location.get();
    if (location.queryObject.platformOverride) {
      Session.set("platformOverride", location.queryObject.platformOverride);
    }
  }
});

Router.map(function() {
  this.route("home", {
    path: "/"
  });
  this.route("/about/", {
    name: "about"
  });
  this.route("/householdList/", {
    name: "householdList",
    fastRender: true
  });
  this.route("/memberList/", {
    name: "memberList",
    waitOn: function () {
      return [
        Meteor.subscribe("memberPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        memberData: memberCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/memberSelect/", {
    name: "memberSelect",
    waitOn: function () {
      return [
        Meteor.subscribe("memberPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    fastRender: true
  });
  this.route("/member/:individualId", {
    name: "member",
    waitOn: function () {
      return [
        Meteor.subscribe("memberPublication"),
        Meteor.subscribe("householdPublication")
      ]
    },
    data: function() {

      var selector = {$or: [
        {"headOfHouse.individualId": parseInt(this.params.individualId)},
        {"spouse.individualId": parseInt(this.params.individualId)},
        {"children.individualId": parseInt(this.params.individualId)}
      ]};

      return {
        memberData: memberCollection.findOne({individualId: parseInt(this.params.individualId)}),
        householdData: householdCollection.findOne(selector)
      };
    },
    fastRender: true
  });
  this.route("/callingSelect/", {
    name: "callingSelect",
    waitOn: function () {
      return Meteor.subscribe("callingPublication")
    },
    fastRender: true
  });
  this.route("/callingGroupList/", {
    name: "callingGroupList",
    waitOn: function () {
      return Meteor.subscribe("callingGroupPublication")
    },
    data: function() {
      return {
        callingData: callingGroupCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/callingGroup/:_id", {
    name: "callingGroup",
    waitOn: function () {
      return Meteor.subscribe("callingGroupPublication")
    },
    data: function() {
      return {
        callingData: callingGroupCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route("/callingChangeList/", {
    name: "callingChangeList",
    waitOn: function () {
      return Meteor.subscribe("callingChangePublication")
    },
    fastRender: true
  });
  this.route("/callingChangeCreate/", {
    name: "callingChangeCreate",
    waitOn: function () {
      return [
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    fastRender: true
  });
  this.route("/callingChangeEdit/:_id", {
    name: "callingChangeEdit",
    waitOn: function () {
      return [
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        callingChangeData: callingChangeCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route("/callingChangeTypeSelect/", {
    name: "callingChangeTypeSelect",
    fastRender: true
  });
  this.route("/meetingList/", {
    name: "meetingList",
    waitOn: function () {
      return Meteor.subscribe("meetingPublication")
    },
    data: function() {
      return {
        meetingData: meetingCollection.find({}, {sort: {meetingDate: -1}})
      };
    },
    fastRender: true
  });
  this.route("/meetingCreate/", {
    name: "meetingCreate",
    waitOn: function () {
      return [
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
  });
  this.route("/meetingEdit/:_id", {
    name: "meetingEdit",
    waitOn: function () {
      return [
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("musicalNumberPublication"),
        Meteor.subscribe("intermediateHymnPublication"),
        Meteor.subscribe("visitorPublication"),
        Meteor.subscribe("announcementPublication"),
        Meteor.subscribe("speakerPublication"),
        Meteor.subscribe("recognitionPublication"),
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        meetingData: meetingCollection.findOne(this.params._id),
        musicalNumberData: musicalNumberCollection.find({meetingId: this.params._id}),
        intermediateHymnData: intermediateHymnCollection.find({meetingId: this.params._id}),
        visitorData: visitorCollection.find({meetingId: this.params._id}),
        announcementData: announcementCollection.find({meetingId: this.params._id}),
        speakerData: speakerCollection.find({meetingId: this.params._id}),
        recognitionData: recognitionCollection.find({meetingId: this.params._id}),
        callingChangeData: callingChangeCollection.find({"meeting._id": this.params._id}, {sort: {type: -1}})
      };
    },
    fastRender: true
  });
  this.route("/meetingSelect/", {
    name: "meetingSelect",
    waitOn: function () {
      return Meteor.subscribe("meetingPublication")
    },
    data: function() {
      return {
        meetingData: meetingCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/hymnSelect/", {
    name: "hymnSelect",
    waitOn: function () {
      return Meteor.subscribe("hymnPublication")
    },
    fastRender: true
  });
  this.route("/attendanceSelect/", {
    name: "attendanceSelect",
    fastRender: true
  });
  this.route("/recognitionTypeSelect/", {
    name: "recognitionTypeSelect",
    waitOn: function () {
      return Meteor.subscribe("recognitionTypePublication")
    },
    data: function() {
      return {
        recognitionTypeData: recognitionTypeCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/sync/", {
    name: "sync",
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("memberPublication"),
        Meteor.subscribe("stakeCallingPublication"),
        Meteor.subscribe("reportPublication")
      ]
    },
    fastRender: true
  });
  this.route("userAccounts");
  this.route("/meetingPrint/:_id", function() {

    meeting = meetingCollection.findOne(this.params._id);

    //meetingDateFormatted = moment(meeting.title).tz("Etc/GMT").format("YYYY-MM-DD");
    meetingDateFormatted = meeting.meetingDate;
    releaseResultArray = callingChangeCollection.find({"meeting._id" : this.params._id, type: "Release"}).fetch();
    callingResultArray = callingChangeCollection.find({"meeting._id" : this.params._id, type: "Call"}).fetch();
    intermediateHymnArray = intermediateHymnCollection.find({meetingId : this.params._id}).fetch();
    visitorArray = visitorCollection.find({meetingId : this.params._id}).fetch();
    musicalNumberArray = musicalNumberCollection.find({meetingId : this.params._id}).fetch();
    announcementArray = announcementCollection.find({meetingId : this.params._id}).fetch();
    speakerArray = speakerCollection.find({meetingId : this.params._id}).fetch();
    recognitionArray = recognitionCollection.find({meetingId : this.params._id}).fetch();

    var doc = new PDFDocument({size: "A4", margin: 50});

    var pageWidth = 520;
    var halfPageWidth = pageWidth / 2;
    var labelColumnWidth = 70;
    var distanceFromTop = 40;
    var distanceFromLeft1 = 40;
    var distanceFromLeft2 = distanceFromLeft1 + labelColumnWidth;
    var distanceFromLeft3 = distanceFromLeft2 + 40;
    var distanceFromLeft4 = distanceFromLeft1 + halfPageWidth;
    var distanceFromLeft5 = distanceFromLeft4 + labelColumnWidth;
    var verticalPositionIncrement = 14;

    doc.fontSize(16);
    doc.text("Sacrament Meeting Agenda", distanceFromLeft1, distanceFromTop, {align: "center", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.fontSize(12);
    doc.text(moment(meeting.meetingDate).format("dddd, MMMM Do YYYY"), distanceFromLeft1, distanceFromTop, {align: "center", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.text("Conducting: ___________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.conducting.switchedPreferredName != "undefined") {
      doc.text(meeting.conducting.switchedPreferredName, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Presiding: _____________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.presiding.switchedPreferredName != "undefined") {
      doc.text(meeting.presiding.switchedPreferredName, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Chorister: _____________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.chorister.switchedPreferredName != "undefined") {
      doc.text(meeting.chorister.switchedPreferredName, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Organist: ______________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.organist.switchedPreferredName != "undefined") {
      doc.text(meeting.organist.switchedPreferredName, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Welcome Visitors", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    if (visitorArray.length > 0) {
      for(var visitorIndex in visitorArray) {
        doc.text("Visitor: _______________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        if (visitorArray[visitorIndex].visitor.switchedPreferredName) {
          var callingList = visitorArray[visitorIndex].visitor.callings.reduce(function(acquiredCallingList, newCalling) {
              return acquiredCallingList + ", " + newCalling.callingName; // return previous acquiredCallingList plus current newCalling
          }, "");
          doc.text(visitorArray[visitorIndex].visitor.switchedPreferredName + callingList, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
        }
        distanceFromTop += verticalPositionIncrement;
      }
    }

    if (typeof announcementArray != "undefined") {
      for(var announcementIndex in announcementArray) {
        doc.text("Announcement: ________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(announcementArray[announcementIndex].text, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }
    }

    doc.text("Opening Hymn: ________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.openingHymn.name != "undefined") {
      doc.text(meeting.openingHymn.number + " - " + meeting.openingHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Invocation: ____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.invocation.switchedPreferredName != "undefined") {
      doc.text(meeting.invocation.switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Ward and Stake Business", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    if (releaseResultArray.length > 0) {
      doc.text('Releases: "We have released the following individuals."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      for(var releaseResultIndex in releaseResultArray) {
        doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].member.switchedPreferredName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].calling.callingName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }

      doc.text('"We propose that they be given a vote of thanks for their service. Those who wish to express appreciation may manifest it by the uplifted hand."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
    }

    if (callingResultArray.length > 0) {
      doc.text('Sustainings: "The following people have been called and we propose that they be sustained."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      for(var callingResultIndex in callingResultArray) {
        doc.text("____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(callingResultArray[callingResultIndex].member.switchedPreferredName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(callingResultArray[callingResultIndex].calling.callingName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }

      doc.text('"Those in favor may manifest it by the uplifted hand.  Those opposed, if any, may manifest it.  We invite those sustained to come to the Bishop’s office immediately after the block to be set apart."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
    }

    if (recognitionArray.length > 0) {
      doc.text("Ordinances and Recognitions", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      if (typeof recognitionArray != "undefined") {
        for(var recognitionIndex in recognitionArray) {
          doc.text(recognitionArray[recognitionIndex].recognitionType.typeName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
          doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
          distanceFromTop += verticalPositionIncrement;
          for(var recognitionMemberIndex in recognitionArray[recognitionIndex].members) {
            doc.text(recognitionArray[recognitionIndex].members[recognitionMemberIndex].switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            distanceFromTop += verticalPositionIncrement;
          }
        }
      }
    }

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    doc.text("Sacrament Hymn: ______________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.sacramentHymn.name != "undefined") {
      doc.text(meeting.sacramentHymn.number + " - " + meeting.sacramentHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Administration of the Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    doc.text('"We thank you for your reverence during the sacrament, and we thank the Priesthood for administering it."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Gospel Messages, Testimonies, and Music", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    if (meeting.fastAndTestimony) {
      doc.text("Bear own testimony then turn time over to members of congregation to bear testimonies.", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      doc.text('"We will end at X minutes after the hour."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }

    if (typeof speakerArray != "undefined") {
      for(var speakerIndex in speakerArray) {
        doc.text(speakerArray[speakerIndex].speaker.switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
        doc.text("Speaker: _____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;

        for(var intermediateHymnIndex in intermediateHymnArray) {
          if ((intermediateHymnArray[intermediateHymnIndex].afterSpeaker - 1) == speakerIndex) {
            doc.text("Intermediate Hymn: _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            if (intermediateHymnArray[intermediateHymnIndex].hymn.number) {
              doc.text(intermediateHymnArray[intermediateHymnIndex].hymn.number + " - " + intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            } else {
              doc.text(intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            }
            distanceFromTop += verticalPositionIncrement;
          }
        }
        for(var musicalNumberIndex in musicalNumberArray) {
          if ((musicalNumberArray[musicalNumberIndex].afterSpeaker - 1) == speakerIndex) {
            doc.text("Musical Number", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            distanceFromTop += verticalPositionIncrement;
            doc.text("Song: ________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            if (musicalNumberArray[musicalNumberIndex].hymn.number) {
              doc.text(musicalNumberArray[musicalNumberIndex].hymn.number + " - " + musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            } else {
              doc.text(musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            }
            distanceFromTop += verticalPositionIncrement;
            if (musicalNumberArray[musicalNumberIndex].performer.switchedPreferredName) {
              doc.text(musicalNumberArray[musicalNumberIndex].performer.switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
              doc.text("Performer: ____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
              distanceFromTop += verticalPositionIncrement;
            }
            if (musicalNumberArray[musicalNumberIndex].accompanist.switchedPreferredName) {
              doc.text(musicalNumberArray[musicalNumberIndex].accompanist.switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
              doc.text("Accompanist: __________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
              distanceFromTop += verticalPositionIncrement;
            }
          }
        }
      }
    }

    doc.text("Closing Hymn: _________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.closingHymn.name != "undefined") {
      doc.text(meeting.closingHymn.number + " - " + meeting.closingHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Benediction: ___________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.benediction.switchedPreferredName != "undefined") {
      doc.text(meeting.benediction.switchedPreferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    /*
    Conducting
    My name is...and (presiding authority) has asked me to conduct this meeting.

    Presiding
    This meeting is presided by...

    Welcome and Announcements
    Visiting Authorities
    We would also like to to recognize...from the stake, who is visiting today. We would also like to welcome any other visitors with us today.

    Organist
    We would like to thank our organist...

    Chorister
    We would like to thank our chorister...who will be leading the music

    Announcements

    Opening Hymn
    We will open our services by singing hymn number...

    Invocation
    We will then have the invocation offered by...

    Ward and Stake Business
    Releases
    The following individuals have been released from positions and we proposed that they be given a vote of thanks for their service...those who wish to express their appreciation may manifest it by the uplifted hand.

    Callings
    It is proposed that we sustain the following to positions in the ward and ask that they stand. ....All those in favor manifest it...Those opposed may manifest it...Thank you to these members who have faithfully accepted calls to serve and thank you for supporting them. We would invite those who have been sustained to go to the Bishop’s office immediately after the block to be set apart

    New Members to Ward
    It is proposed that we welcome the following new members to the ward. Please stand to be recognized, and remain standing while your names are presented...All those who accept this/these members in full fellowship in the ward, please signify by the uplifted hand.

    Naming and Blessing of a Child
    Brother and Sister...will be blessing their child... We would like to invite those who will be participating to come forward.

    Child of Record Baptism
    We would like to recognize...who was baptised and confirmed. We welcome him/her as the newest member of our ward.

    Confirmation
    We would like to invite newly baptised member...to come forward together with those who will participate in the confirmation. Confirm and bestow gift of the Holy Ghost on new members (then present as new ward members)

    Aaronic Priesthood Advancement
    We propose that...receive the Aaronic priesthood and be ordained a... Would you please stand? Those in favor may manifest it by the uplifted hand. Those opposed, if any, may manifest it.

    Other Recgonitions
    Young Men, Young Women, Primary Advancement, Achievement Days

    Stake Business
    We now turn the time over to...from...to conduct some stake business.

    Sacrament Services
    Sacrament Hymn
    We will now prepare for the sacrament by singing hymn number...Following the hymn, the sacrament will be administered to the congregation by the Priesthood.

    Gospel Messages, Testimonies, and Music
    We thank you for your reverence during the sacrament and we would like to thank the Aaronic priesthood for the reverent manner in which they prepared, administered, and passed the sacrament and invite them to return and sit with their families.

    If testimony meeting, bear own testimony then turn time over to members of congregation to bear heartfelt testimonies and relate faith-promoting experiences. Please keep testimonies brief so more people may have the opportunity to participate.  We will end at 5 after the hour.
    Youth Speaker
    We will first hear from...then...

    Speaker 1

    Speaker 2

    Intermediate Hymn
    Our intermediate hymn will be number

    Musical Number
    We will have a musical number...

    Speaker 3
    Following the music, we shall hear from...

    Speaker 4

    Closing
    We would like to thank all of those who have participated in our sacrament service.  We would like to thank...and...for their talks today.
    Closing Hymn
    We will close our meeting by singing hymn number...

    Benediction
    We will then have the benediction offered by...

    Administrative
    Attendance
    */



    this.response.writeHead(200, {
      "Content-type": "application/pdf"
    });
    this.response.end( doc.outputSync() );
  }, {where: "server"});


});
