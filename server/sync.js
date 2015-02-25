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
      var auth_url="https://signin.lds.org/login.html";

      var result = HTTP.post(auth_url, {params: {username: inUsername, password: inPassword}});

      var cookie_value = result['headers']['set-cookie'];

      for(var c in cookie_value) {
        if(cookie_value[c].indexOf("Expires") !== -1) {
          cookie_value[c] = "";
        }
      }

      var unit;
      var current_user_unit_url="https://www.lds.org/directory/services/ludrs/unit/current-user-ward-stake/";
      result = Meteor.http.call("GET", current_user_unit_url, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookie_value,
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

      var household_list;

      var household_list_url="https://www.lds.org/directory/services/ludrs/mem/member-list/" + unit.wardUnitNo;
      result = Meteor.http.call("GET", household_list_url, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookie_value,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      household_list = JSON.parse(result.content);

      //remove all households and members currently in the ward
      householdCollection.remove({wardUnitNo: unit.wardUnitNo});
      memberCollection.remove({wardUnitNo: unit.wardUnitNo});

      //add all households in ward
      for(var household_index in household_list) {
        householdCollection.insert(household_list[household_index]);

        //insert head of household, spouse, and children, and append on the ward unit number
        memberCollection.insert(_.extend(household_list[household_index].headOfHouse, {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(household_list[household_index].headOfHouse.preferredName)}));
        memberCollection.insert(_.extend(household_list[household_index].spouse, {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(household_list[household_index].spouse.preferredName)}));
        for(var children_index in household_list[household_index].children) {
          memberCollection.insert(_.extend(household_list[household_index].children[children_index], {wardUnitNo: unit.wardUnitNo, switchedPreferredName: switchName(household_list[household_index].children[children_index].preferredName)}));
        }
      }
      //remove all the junk records
      memberCollection.remove({preferredName: "", wardUnitNo: unit.wardUnitNo});

      var calling_list;

      var calling_list_url="https://www.lds.org/directory/services/ludrs/1.1/unit/ward-leadership-positions/" + unit.wardUnitNo + "/true";
      result = Meteor.http.call("GET", calling_list_url, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": cookie_value,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      calling_list = JSON.parse(result.content);

      //remove all positions in the ward
      callingCollection.remove({wardUnitNo: unit.wardUnitNo});

      //for each group of positions
      for(var calling_index in calling_list.unitLeadership) {

        var group_list;

        var group_list_url="https://www.lds.org/directory/services/ludrs/1.1/unit/stake-leadership-group-detail/" + unit.wardUnitNo + "/" + calling_list.unitLeadership[calling_index].groupKey + "/" + calling_list.unitLeadership[calling_index].instance;
        group_result = Meteor.http.call("GET", group_list_url, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": cookie_value,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        group_list = JSON.parse(group_result.content);

        callingCollection.insert(_.extend(calling_list.unitLeadership[calling_index], {leaders: group_list.leaders, wardUnitNo: unit.wardUnitNo}));

        for(var leader_index in group_list.leaders) {
          memberCollection.update({individualId: group_list.leaders[leader_index].individualId}, { $addToSet: { "callings": { "callingName": group_list.leaders[leader_index].callingName, "positionId": group_list.leaders[leader_index].positionId } } } );
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
