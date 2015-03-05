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
        wardUnitNo: unit.wardUnitNo
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: update
      }, function(error){
        if(error){
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
        householdCollection.insert(householdList[householdIndex]);

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
          memberGroupCollection.update({individualId: groupList.leaders[leaderIndex].individualId}, { $addToSet: { "callings": { "callingName": groupList.leaders[leaderIndex].callingName, "positionId": groupList.leaders[leaderIndex].positionId } } } );
        }
        //

      }

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});
