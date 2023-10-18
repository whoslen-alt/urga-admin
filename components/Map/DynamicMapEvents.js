import { useMapEvents } from 'react-leaflet';

function DynamicMapEvents({ setLatLng }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setLatLng({ lat, lng });
    },
  });

  return null;
}
export default DynamicMapEvents;
