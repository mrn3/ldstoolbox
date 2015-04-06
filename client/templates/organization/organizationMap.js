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

    var marker = [];
    var infoWindow = [];

    for (householdIndex in householdArray) {
      var latlng = new google.maps.LatLng(householdArray[householdIndex].householdInfo.address.latitude, householdArray[householdIndex].householdInfo.address.longitude);

      var contentString = householdArray[householdIndex].headOfHousehold.name;

      infoWindow[householdIndex] = new google.maps.InfoWindow({
        content: contentString
      });

      marker[householdIndex] = new google.maps.Marker({
        position: latlng,
        map: map.instance,
        title: householdArray[householdIndex].headOfHousehold.name
      });

      google.maps.event.addListener(marker[householdIndex], 'click', function() {
        infoWindow[householdIndex].open(map.instance, marker[householdIndex]);
      });
    }
  });
});
