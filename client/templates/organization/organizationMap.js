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
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });

    var householdArray = Session.get("householdArray");

    for (householdIndex in householdArray) {
      //console.log(householdArray[householdIndex].householdInfo.address.latitude);
      var latlng = new google.maps.LatLng(householdArray[householdIndex].householdInfo.address.latitude, householdArray[householdIndex].householdInfo.address.longitude);
      var marker = new google.maps.Marker({
        position: latlng,
        map: map.instance
      });
    }
  });
});
