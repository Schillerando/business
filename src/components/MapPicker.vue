<template>
  <div>
    <div id="mapContainer"></div>
  </div>
</template>

<script>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default {
  name: 'MapPicker',
  props: ['data', 'isExtrasEditing'],
  emits: ['pickCoordinates'],
  setup() {
    var pin = new Image();
    pin.src = require('@/assets/pin.png');

    return {
      pin,
    };
  },
  async mounted() {
    var mapWidth = document.getElementById('mapContainer');
    console.log(mapWidth.clientWidth);

    if (mapWidth.clientWidth < 450) {
      var startZoom = 17;
    } else {
      startZoom = 18;
    }

    var startPos = [48.93510181358248, 9.262896180152895];

    var map = L.map('mapContainer').setView(startPos, startZoom);
    map.setZoom(16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 22,
      minZoom: 16,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    window.addEventListener('resize', function () {
        var width = document.getElementById('mapContainer').clientWidth;
        if (width < 450) {
          map.setZoom(17);
        } else {
          map.setZoom(18);
        }
      });

    if ('geolocation' in navigator) {

      var marker = L.circleMarker([
          0,
          0,
        ]).addTo(map);

      navigator.geolocation.watchPosition((position) => {
        marker.setLatLng([position.coords.latitude, position.coords.longitude])
      });
    } else {
      console.log(false);
    }

    let icon = L.icon({
      iconUrl: this.pin.src,
      iconSize: [29, 45],
      iconAnchor: [14.5, 45],
    });

    var pin = L.marker([0, 0], {
      icon: icon,
    }).addTo(map);

    map.on('click', (e) => {
      if(this.isExtrasEditing) {
        pin.setLatLng(e.latlng);
        this.$emit('pickCoordinates', e.latlng)
      }
    });

    console.log(this.data)

    if (this.data != null && this.data.length == 2) {
      pin.setLatLng([this.data[0], this.data[1]]);
    }
  },
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
</style>
