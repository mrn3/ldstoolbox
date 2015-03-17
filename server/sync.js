function switchName(inName) {
  commaPosition = inName.indexOf(",");
  lastName = inName.substr(0, commaPosition);
  otherNames = inName.substr(commaPosition+2, inName.length);
  return otherNames + " " + lastName;
}

Meteor.methods({
  authenticateMember: function(inUsername, inPassword) {
    this.unblock();
    try {
      var authUrl="https://signin.lds.org/login.html";

      var result = HTTP.post(authUrl, {params: {username: inUsername, password: inPassword}});

      var ldsAccountCookieValue = result['headers']['set-cookie'];

      for (var c in ldsAccountCookieValue) {
        if (ldsAccountCookieValue[c].indexOf("Expires") !== -1) {
          ldsAccountCookieValue[c] = "";
        }
      }

      var properties = {
        ldsAccountCookieValue:   ldsAccountCookieValue
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  syncUnits: function(inUsername, inPassword) {
    this.unblock();
    try {
      //get units in stake
      var unitList;

      var unitListUrl="https://www.lds.org/directory/services/ludrs/unit/current-user-units/";
      result = Meteor.http.call("GET", unitListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccountCookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      unitList = JSON.parse(result.content);

      //remove all wards in stake
      unitCollection.remove({stakeUnitNo: unitList[0].stakeUnitNo});

      //for each unit, insert into units collection
      for(var unitIndex in unitList[0].wards) {
        unitCollection.insert(unitList[0].wards[unitIndex]);
      }

      //get current user's ward
      var unit;
      var currentUserUnitUrl="https://www.lds.org/directory/services/ludrs/unit/current-user-ward-stake/";
      result = Meteor.http.call("GET", currentUserUnitUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccountCookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      unit = JSON.parse(result.content);

      //update the user to have additional fields to link
      var properties = {
        wardUnitNo:   unit.wardUnitNo,
        wardName:     unit.wardName,
        stakeUnitNo:  unit.stakeUnitNo,
        stakeName:    unit.stakeName,
        areaUnitNo:   unit.areaUnitNo
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  syncWardMembers: function(inWardUnitNo) {
    this.unblock();
    try {
      var householdList;

      var householdListUrl="https://www.lds.org/directory/services/ludrs/mem/member-list/" + inWardUnitNo;
      result = Meteor.http.call("GET", householdListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccountCookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      householdList = JSON.parse(result.content);

      //remove all households and members currently in the ward
      householdCollection.remove({wardUnitNo: inWardUnitNo});
      memberCollection.remove({wardUnitNo: inWardUnitNo});

      //add all households in ward
      for(var householdIndex in householdList) {
        householdCollection.insert(_.extend(householdList[householdIndex], {wardUnitNo: inWardUnitNo}));

        //insert head of household, spouse, and children, and append on the ward unit number
        memberCollection.insert(_.extend(householdList[householdIndex].headOfHouse, {wardUnitNo: inWardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].headOfHouse.preferredName)}));
        memberCollection.insert(_.extend(householdList[householdIndex].spouse, {wardUnitNo: inWardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].spouse.preferredName)}));
        for(var childrenIndex in householdList[householdIndex].children) {
          memberCollection.insert(_.extend(householdList[householdIndex].children[childrenIndex], {wardUnitNo: inWardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].children[childrenIndex].preferredName)}));
        }
      }
      //remove all the junk records
      memberCollection.remove({preferredName: "", wardUnitNo: inWardUnitNo});

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  syncStakeMembers: function(inStakeUnitNo) {
    var unitList = unitCollection.find({stakeUnitNo: inStakeUnitNo}).fetch();
    for (var unitIndex in unitList) {
      console.log(unitList[unitIndex].wardUnitNo);
      Meteor.call("syncWardMembers", unitList[unitIndex].wardUnitNo, function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  },
  syncWardCallings: function(inWardUnitNo) {
    this.unblock();
    try {
      var callingList;

      var callingListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/ward-leadership-positions/" + inWardUnitNo + "/true";
      result = Meteor.http.call("GET", callingListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccountCookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      callingList = JSON.parse(result.content);

      //remove all positions in the ward
      callingCollection.remove({wardUnitNo: inWardUnitNo});
      callingGroupCollection.remove({wardUnitNo: inWardUnitNo});

      //for each group of positions
      for(var callingIndex in callingList.unitLeadership) {

        var groupList;

        var groupListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/stake-leadership-group-detail/" + inWardUnitNo + "/" + callingList.unitLeadership[callingIndex].groupKey + "/" + callingList.unitLeadership[callingIndex].instance;
        groupResult = Meteor.http.call("GET", groupListUrl, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": Meteor.user().ldsAccountCookieValue,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        groupList = JSON.parse(groupResult.content);

        callingGroupCollection.insert(_.extend(callingList.unitLeadership[callingIndex], {leaders: groupList.leaders, wardUnitNo: inWardUnitNo}));

        for(var leaderIndex in groupList.leaders) {
          memberCollection.update({individualId: groupList.leaders[leaderIndex].individualId}, { $addToSet: { "callings": { "callingName": groupList.leaders[leaderIndex].callingName, "positionId": groupList.leaders[leaderIndex].positionId } } } );
          callingCollection.insert({"callingName": groupList.leaders[leaderIndex].callingName, "positionId": groupList.leaders[leaderIndex].positionId, "displayName": groupList.leaders[leaderIndex].displayName, wardUnitNo: inWardUnitNo});
        }
      }

      //dump in generic callings too
      //callingCollection.insert({callingName: "Bishopric", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Bishop", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Bishopric First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Bishopric Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Executive Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Clerk", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk--Membership", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk—Finance", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "(Acting Ward Leader)", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "High Priests Group Leadership", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group First Assistant", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Second Assistant", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Assistant Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Instructor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "High Priests Home Teaching District Supervisor", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Elders Quorum Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Assistant Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Instructor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Elders Home Teaching District Supervisor", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Relief Society Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Assistant Secretary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Meeting Coordinator", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Meeting Committee Member", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Compassionate", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Service Coordinator", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Compassionate", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Service Assistant Coordinator", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Teacher", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Visiting Teaching Coordinator", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Visiting Teaching", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "District Supervisor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Music Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Pianist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Relief Society Adviser to Young", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Single Adult Sisters", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult Leader", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Young Men Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Priests Quorum", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum First Assistant", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Second Assistant", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Teachers Quorum", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Deacons Quorum", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Scouting", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scouting Committee Chairman", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scouting Committee Member", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scoutmaster", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Assistant Scoutmaster", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Varsity Coach", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Assistant Varsity Coach", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Venturing Crew Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Assistant Venturing Crew Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Executive Officer", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Chartered Organization Representative", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Young Men", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men Stake Youth", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Committee Member", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Men Sports Coach", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Laurel", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Mia Maid", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Beehive", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Young Women", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Laurel Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Beehive Assistant Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Music Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Pianist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Activity Specialist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Camp Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Assistant Camp Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Stake Youth Committee", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Sports Specialist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Young Women Assistant Sports", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Specialist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Sunday School", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Meetinghouse Librarian", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Librarian", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Assistant Librarian", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Gospel Doctrine", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Gospel Principles", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Marriage and Family Relations", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Missionary Preparation", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Teaching the Gospel", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Temple Preparation", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Teacher - Temple and Family", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "History", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 12", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 13", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 14", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 15", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 16", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 17", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Primary Presidency", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary President", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary First Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Second Counselor", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Secretary", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Primary", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Pianist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Music Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Nursery Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Nursery Leader - Pre-Nursery", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Nursery Music Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Sunbeam", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 4", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 5", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 6", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 7", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 8", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 9", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 10", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 11", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Cub Scouts", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Cub Scout Committee Chairman", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Cub Scout Committee Member", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Cubmaster", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Webelos Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Webelos Assistant Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Bear Den Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Bear Den Assistant Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Wolf Den Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Wolf Den Assistant Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scouting (eleven year old)", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Eleven-Year-Old Scout Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Activity Days", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Activity Days Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Primary Activity Days Assistant Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Technology", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Website Administrator", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Activities and Sports", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Athletic Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Activities Committee Chairman", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Activities Committee Specialist", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Ward Missionaries", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Mission Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Missionary - Ward", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Missionary - Full Time", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Employment and Welfare", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Welfare Specialist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Employment Specialist", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Music", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priesthood Pianist or Organist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Priesthood Music Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Choir Accompanist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Music Adviser", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Choir Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Chorister", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Organist or Pianist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Music Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Music Chairman", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Facilities", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Building Representative", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 1", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 2", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 3", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 4", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 5", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Family History", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Family History Leader", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Family History Consultant", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Indexing Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Indexing Assistant Director", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Indexing Worker", wardUnitNo: inWardUnitNo});
      //callingCollection.insert({callingName: "Other Callings", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "History Specialist", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Magazine Representative", wardUnitNo: inWardUnitNo});
      callingCollection.insert({callingName: "Ward Disability Specialist", wardUnitNo: inWardUnitNo});

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  syncStakeCallings: function(inStakeUnitNo) {
    var unitList = unitCollection.find({stakeUnitNo: inStakeUnitNo}).fetch();
    for (var unitIndex in unitList) {
      console.log(unitList[unitIndex].wardUnitNo);
      Meteor.call("syncWardCallings", unitList[unitIndex].wardUnitNo, function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  }
});
