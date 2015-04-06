Template.organizationMap.helpers({
  organizationMapOptions: function() {
    // Make sure the maps API has loaded
    //console.log(this);
    if (GoogleMaps.loaded()) {
      // Map initialization options

      var householdArray = Session.get("householdArray");

      //just center on the first one in the list
      return {
        center: new google.maps.LatLng(
          householdArray[0].householdInfo.address.latitude,
          householdArray[0].householdInfo.address.longitude
        ),
        zoom: 18
      };
    }
  }
});

Template.organizationMap.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready("organizationMap", function(map) {
    // Add markers to the map once it's ready
    var householdArray = Session.get("householdArray");
    var individualIdArray = Session.get("individualIdArray");

    var infoWindowArray = [];

    for (householdIndex in householdArray) {
      var latlng = new google.maps.LatLng(householdArray[householdIndex].householdInfo.address.latitude, householdArray[householdIndex].householdInfo.address.longitude);

      contentString = "<h4>Household Members</h4>";
      if (householdArray[householdIndex].headOfHousehold && householdArray[householdIndex].headOfHousehold.name) {
        if (individualIdArray.indexOf(householdArray[householdIndex].headOfHousehold.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].headOfHousehold.name + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].headOfHousehold.name + "<br />";
        }
      }
      if (householdArray[householdIndex].spouse && householdArray[householdIndex].spouse.name) {
        if (individualIdArray.indexOf(householdArray[householdIndex].spouse.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].spouse.name + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].spouse.name + "<br />";
        }
      }
      for (otherHouseholdMembersIndex in householdArray[householdIndex].otherHouseholdMembers) {
        if (householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name) {
          if (individualIdArray.indexOf(householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].individualId) > -1) {
            contentString += "<strong>" + householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name + "</strong>" + "<br />";
          } else {
            contentString += householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name + "<br />";
          }
        }
      }

      if (householdArray[householdIndex].householdInfo && householdArray[householdIndex].householdInfo.address) {
        contentString += "<h4>Address</h4>";
        if (householdArray[householdIndex].householdInfo.address.addr1) {
          contentString += householdArray[householdIndex].householdInfo.address.addr1 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr2) {
          contentString += householdArray[householdIndex].householdInfo.address.addr2 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr3) {
          contentString += householdArray[householdIndex].householdInfo.address.addr3 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr4) {
          contentString += householdArray[householdIndex].householdInfo.address.addr4 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr5) {
          contentString += householdArray[householdIndex].householdInfo.address.addr5 + "<br />";
        }
      }

      infoWindowArray[householdArray[householdIndex].headOfHousehold.name] = new google.maps.InfoWindow({
        content: contentString
      });

      marker = new google.maps.Marker({
        position: latlng,
        map: map.instance,
        title: householdArray[householdIndex].headOfHousehold.name
      });

      google.maps.event.addListener(marker, 'click', function() {
        for (infoWindowIndex in infoWindowArray) {
          infoWindowArray[infoWindowIndex].close();
        }
        infoWindowArray[this.getTitle()].open(map.instance, this);
      });
    }
  });
});
