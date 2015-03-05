Router.configure({
  layoutTemplate: 'layout'
});

Meteor.startup(function () {
  if (Meteor.isClient) {
    var location = Iron.Location.get();
    if (location.queryObject.platformOverride) {
      Session.set('platformOverride', location.queryObject.platformOverride);
    }
  }
});

Router.map(function() {
  this.route('home', {path: '/'});
  this.route('/memberList/', {
    name: 'memberList',
    data: function() {
      return {
        householdData: householdCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/memberSelect/', {
    name: 'memberSelect',
    fastRender: true
  });
  this.route('/member/:individualId', {
    name: 'member',
    data: function() {
      //console.log(memberCollection.findOne({individualId: this.params.individualId}));
      return {
        memberData: memberCollection.findOne({individualId: this.params.individualId})
      };
    },
    fastRender: true
  });
  this.route('/household/:_id', {
    name: 'household',
    data: function() {
      return {
        householdData: householdCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('/callingGroupList/', {
    name: 'callingGroupList',
    data: function() {
      return {
        callingData: callingGroupCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/callingGroup/:_id', {
    name: 'callingGroup',
    data: function() {
      return {
        callingData: callingGroupCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('/callingSelect/', {
    name: 'callingSelect',
    fastRender: true
  });
  this.route('/callingChangeList/', {
    name: 'callingChangeList',
    data: function() {
      return {
        callingChangeData: callingChangeCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/callingChangeCreate/', {
    name: 'callingChangeCreate',
    fastRender: true
  });
  this.route('/callingChangeEdit/:_id', {
    name: 'callingChangeEdit',
    data: function() {
      return {
        callingChangeData: callingChangeCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('/callingChangeTypeSelect/', {
    name: 'callingChangeTypeSelect',
    fastRender: true
  });
  this.route('/meetingList/', {
    name: 'meetingList',
    data: function() {
      return {
        meetingData: meetingCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/meetingCreate/', {
    name: 'meetingCreate'
  });
  this.route('/meetingEdit/:_id', {
    name: 'meetingEdit',
    data: function() {
      return {
        meetingData: meetingCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('sync');
  this.route('actionSheet');
  this.route('backdrop');
  this.route('forms', {
    data: function () {
      return {
        post: Posts.find().fetch()[0]
      };
    }
  });
  this.route('headersFooters');
  this.route('lists');
  this.route('loading');
  this.route('modal');
  this.route('navigation');
  this.route('navigation.one', {path: '/navigation/one'});
  this.route('navigation.two', {path: '/navigation/two'});
  this.route('navigation.three', {path: '/navigation/three'});
  this.route('popover');
  this.route('popup');
  this.route('index');
  this.route('slideBox');
  this.route('tabs.one', {path: '/tabs/one', layoutTemplate: 'tabsLayout'});
  this.route('tabs.two', {path: '/tabs/two', layoutTemplate: 'tabsLayout'});
  this.route('tabs.three', {path: '/tabs/three', layoutTemplate: 'tabsLayout'});
  this.route('tabs.four', {path: '/tabs/four', layoutTemplate: 'tabsLayout'});
  this.route('userAccounts');


  this.route('/meetingPrint/:_id', function() {

    meeting = meetingCollection.findOne(this.params._id);

    //meetingDateFormatted = moment(meeting.title).tz('Etc/GMT').format('YYYY-MM-DD');
    meetingDateFormatted = meeting.meetingDate;
    releaseResultArray = callingChangeCollection.find({type: "Release", datePresented : new Date(meetingDateFormatted)}).fetch();
    callingResultArray = callingChangeCollection.find({type: "Call", datePresented : new Date(meetingDateFormatted)}).fetch();

    var doc = new PDFDocument({size: 'A4', margin: 50});

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

    doc.text("Conducting: ___________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.conducting != "undefined") {
      doc.text(meeting.conducting, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Presiding: _____________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.presiding != "undefined") {
      doc.text(meeting.presiding, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Chorister: _____________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.chorister != "undefined") {
      doc.text(meeting.chorister, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Organist: ______________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (typeof meeting.organist != "undefined") {
      doc.text(meeting.organist, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Visiting Authorities: _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.visitingAuthority != "undefined") {
      doc.text(meeting.visitingAuthority, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Welcome Visitors", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    doc.text("Announcements: _____________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;
    if (typeof meeting.announcements != "undefined") {
      doc.text(meeting.announcements, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;


    doc.text("Opening Hymn: ________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.openingHymn != "undefined") {
      doc.text(meeting.openingHymn, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Invocation: ____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.invocation != "undefined") {
      doc.text(meeting.invocation, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement+5;

    doc.fontSize(14);
    doc.text("Ward and Stake Business", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    if (releaseResultArray.length > 0) {
      doc.text('Releases: "We have released the following individuals."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      for(var releaseResultIndex in releaseResultArray) {
        doc.text("____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].memberName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].callingName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
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
        doc.text(callingResultArray[callingResultIndex].memberName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(callingResultArray[callingResultIndex].callingName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }

      doc.text('"Those in favor may manifest it by the uplifted hand.  Those opposed, if any, may manifest it.  We invite those sustained to come to the Bishop’s office immediately after the block to be set apart."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
    }

    if (typeof meeting.recognition1Type != "undefined") {
      doc.text(meeting.recognition1Type + ": _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      recognition1People = meeting.recognition1Person1;
      if (typeof meeting.recognition1Person2 != "undefined") {
        recognition1People += ", " + meeting.recognition1Person2;
      }
      if (typeof meeting.recognition1Person3 != "undefined") {
        recognition1People += ", " + meeting.recognition1Person3;
      }
      doc.text(recognition1People, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }
    if (typeof meeting.recognition2Type != "undefined") {
      doc.text(meeting.recognition2Type + ": _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      recognition2People = meeting.recognition2Person1;
      if (typeof meeting.recognition2Person2 != "undefined") {
        recognition2People += ", " + meeting.recognition2Person2;
      }
      if (typeof meeting.recognition2Person3 != "undefined") {
        recognition2People += ", " + meeting.recognition2Person3;
      }
      doc.text(recognition2People, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }
    if (typeof meeting.recognition3Type != "undefined") {
      doc.text(meeting.recognition3Type + ": _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      recognition3People = meeting.recognition3Person1;
      if (typeof meeting.recognition3Person2 != "undefined") {
        recognition3People += ", " + meeting.recognition3Person2;
      }
      if (typeof meeting.recognition3Person3 != "undefined") {
        recognition3People += ", " + meeting.recognition3Person3;
      }
      doc.text(recognition3People, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }

    doc.fontSize(14);
    doc.text("Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    doc.text("Sacrament Hymn: ______________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.sacramentHymn != "undefined") {
      doc.text(meeting.sacramentHymn, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Administration of the Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    doc.text('"We thank you for your reverence during the sacrament, and we thank the Priesthood for administering it."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;

    doc.text("Speakers: _______________________________________________________________________________________________________________________________________________________________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.speaker1 != "undefined") {
      doc.text(meeting.speaker1, distanceFromLeft2, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;
    if (typeof meeting.speaker2 != "undefined") {
      doc.text(meeting.speaker2, distanceFromLeft2, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;
    if (typeof meeting.speaker3 != "undefined") {
      doc.text(meeting.speaker3, distanceFromLeft2, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    if (typeof meeting.intermediateHymn != "undefined") {
      doc.text("Intermediate Hymn: _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      doc.text(meeting.intermediateHymn, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }

    if (typeof meeting.musicalNumber != "undefined") {
      doc.text("Musical Number: _______________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      doc.text(meeting.musicalNumber, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }

    doc.text("Speakers: __________________________________________________________________________________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.speaker4 != "undefined") {
      doc.text(meeting.speaker4, distanceFromLeft2, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;
    if (typeof meeting.speaker5 != "undefined") {
      doc.text(meeting.speaker5, distanceFromLeft2, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Closing Hymn: _________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.closingHymn != "undefined") {
      doc.text(meeting.closingHymn, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Benediction: ___________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (typeof meeting.benediction != "undefined") {
      doc.text(meeting.benediction, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
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
      'Content-type': 'application/pdf'
    });
    this.response.end( doc.outputSync() );
  }, {where: 'server'});


});
