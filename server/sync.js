function switchName(inName) {
  commaPosition = inName.indexOf(",");
  lastName = inName.substr(0, commaPosition);
  otherNames = inName.substr(commaPosition+2, inName.length);
  return otherNames + " " + lastName;
}

Meteor.methods({
  syncMembers: function(inUsername, inPassword) {
    this.unblock();
    try {
      var authUrl="https://signin.lds.org/login.html";

      var result = HTTP.post(authUrl, {params: {username: inUsername, password: inPassword}});

      var cookieValue = result['headers']['set-cookie'];

      for(var c in cookieValue) {
        if(cookieValue[c].indexOf("Expires") !== -1) {
          cookieValue[c] = "";
        }
      }

      var unit;
      var currentUserUnitUrl="https://www.lds.org/directory/services/ludrs/unit/current-user-ward-stake/";
      result = Meteor.http.call("GET", currentUserUnitUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      unit = JSON.parse(result.content);

      unitCollection.remove({wardUnitNo: unit.wardUnitNo});
      unitCollection.insert(unit);

      //update the user to have additional fields to link
      var update = {
        wardUnitNo:   unit.wardUnitNo,
        wardName:     unit.wardName,
        stakeUnitNo:  unit.stakeUnitNo,
        stakeName:    unit.stakeName,
        areaUnitNo:   unit.areaUnitNo
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: update
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      var householdList;

      var householdListUrl="https://www.lds.org/directory/services/ludrs/mem/member-list/" + unit.wardUnitNo;
      result = Meteor.http.call("GET", householdListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      householdList = JSON.parse(result.content);

      //remove all households and members currently in the ward
      householdCollection.remove({wardUnitNo: unit.wardUnitNo});
      memberCollection.remove({wardUnitNo: unit.wardUnitNo});

      //add all households in ward
      for(var householdIndex in householdList) {
        householdCollection.insert(_.extend(householdList[householdIndex], {wardUnitNo: unit.wardUnitNo}));

        //insert head of household, spouse, and children, and append on the ward unit number
        memberCollection.insert(_.extend(householdList[householdIndex].headOfHouse, {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].headOfHouse.preferredName)}));
        memberCollection.insert(_.extend(householdList[householdIndex].spouse, {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].spouse.preferredName)}));
        for(var childrenIndex in householdList[householdIndex].children) {
          memberCollection.insert(_.extend(householdList[householdIndex].children[childrenIndex], {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(householdList[householdIndex].children[childrenIndex].preferredName)}));
        }
      }
      //remove all the junk records
      memberCollection.remove({preferredName: "", wardUnitNo: unit.wardUnitNo});

      var callingList;

      var callingListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/ward-leadership-positions/" + unit.wardUnitNo + "/true";
      result = Meteor.http.call("GET", callingListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      callingList = JSON.parse(result.content);

      //remove all positions in the ward
      callingCollection.remove({wardUnitNo: unit.wardUnitNo});
      callingGroupCollection.remove({wardUnitNo: unit.wardUnitNo});

      //for each group of positions
      for(var callingIndex in callingList.unitLeadership) {

        var groupList;

        var groupListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/stake-leadership-group-detail/" + unit.wardUnitNo + "/" + callingList.unitLeadership[callingIndex].groupKey + "/" + callingList.unitLeadership[callingIndex].instance;
        groupResult = Meteor.http.call("GET", groupListUrl, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": cookieValue,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        groupList = JSON.parse(groupResult.content);

        callingGroupCollection.insert(_.extend(callingList.unitLeadership[callingIndex], {leaders: groupList.leaders, wardUnitNo: unit.wardUnitNo}));

        for(var leaderIndex in groupList.leaders) {
          memberCollection.update({individualId: groupList.leaders[leaderIndex].individualId}, { $addToSet: { "callings": { "callingName": groupList.leaders[leaderIndex].callingName, "positionId": groupList.leaders[leaderIndex].positionId } } } );
          callingCollection.insert({"callingName": groupList.leaders[leaderIndex].callingName, "positionId": groupList.leaders[leaderIndex].positionId, "displayName": groupList.leaders[leaderIndex].displayName, wardUnitNo: unit.wardUnitNo});
        }
        //

      }

      //dump in generic callings too
      //callingCollection.insert({callingName: "Bishopric", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Bishop", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Bishopric First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Bishopric Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Executive Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Clerk", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk--Membership", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Assistant Clerk—Finance", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "(Acting Ward Leader)", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "High Priests Group Leadership", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group First Assistant", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Second Assistant", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Assistant Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Group Instructor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "High Priests Home Teaching District Supervisor", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Elders Quorum Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Assistant Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Quorum Instructor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Elders Home Teaching District Supervisor", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Relief Society Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Assistant Secretary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Meeting Coordinator", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Meeting Committee Member", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Compassionate", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Service Coordinator", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Compassionate", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Service Assistant Coordinator", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Teacher", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Visiting Teaching Coordinator", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Visiting Teaching", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "District Supervisor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Music Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Pianist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Relief Society Adviser to Young", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Single Adult Sisters", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Single Adult Leader", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Young Men Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Priests Quorum", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum First Assistant", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Second Assistant", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Teachers Quorum", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Secretary", wardUnitNo: unit.wardUnitNo});
      ca//llingCollection.insert({callingName: "Deacons Quorum", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Scouting", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scouting Committee Chairman", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scouting Committee Member", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scoutmaster", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Assistant Scoutmaster", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Varsity Coach", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Assistant Varsity Coach", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Venturing Crew Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Assistant Venturing Crew Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Executive Officer", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Chartered Organization Representative", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Young Men", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men Stake Youth", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Committee Member", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priests Quorum Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teachers Quorum Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Deacons Quorum Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Men Sports Coach", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Laurel", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Mia Maid", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Beehive", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Young Women", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Laurel Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mia Maid Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Beehive Assistant Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Music Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Pianist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Activity Specialist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Camp Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Assistant Camp Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Stake Youth Committee", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Sports Specialist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Young Women Assistant Sports", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Specialist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Sunday School", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Meetinghouse Librarian", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Librarian", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Assistant Librarian", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Gospel Doctrine", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Gospel Principles", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Marriage and Family Relations", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Missionary Preparation", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Teaching the Gospel", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Temple Preparation", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Teacher - Temple and Family", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "History", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 12", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 13", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 14", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 15", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 16", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Sunday School Teacher - Course 17", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Primary Presidency", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary President", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary First Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Second Counselor", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Secretary", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Primary", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Pianist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Music Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Nursery Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Nursery Leader - Pre-Nursery", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Nursery Music Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Sunbeam", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 4", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 5", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 6", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - CTR 7", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 8", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 9", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 10", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Teacher - Valiant 11", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Cub Scouts", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Cub Scout Committee Chairman", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Cub Scout Committee Member", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Cubmaster", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Webelos Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Webelos Assistant Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Bear Den Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Bear Den Assistant Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Wolf Den Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Wolf Den Assistant Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scouting (eleven year old)", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Eleven-Year-Old Scout Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Activity Days", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Activity Days Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Primary Activity Days Assistant Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Technology", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Website Administrator", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Activities and Sports", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Athletic Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Activities Committee Chairman", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Activities Committee Specialist", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Ward Missionaries", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Mission Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Missionary - Ward", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Missionary - Full Time", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Employment and Welfare", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Welfare Specialist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Employment Specialist", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Music", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priesthood Pianist or Organist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Priesthood Music Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Choir Accompanist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Music Adviser", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Choir Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Chorister", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Organist or Pianist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Music Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Music Chairman", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Facilities", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Building Representative", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 1", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 2", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 3", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 4", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Scheduler--Building 5", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Family History", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Family History Leader", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Family History Consultant", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Indexing Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Indexing Assistant Director", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Indexing Worker", wardUnitNo: unit.wardUnitNo});
      //callingCollection.insert({callingName: "Other Callings", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "History Specialist", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Magazine Representative", wardUnitNo: unit.wardUnitNo});
      callingCollection.insert({callingName: "Ward Disability Specialist", wardUnitNo: unit.wardUnitNo});

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});
