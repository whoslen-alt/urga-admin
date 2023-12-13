import dynamic from 'next/dynamic';

const DynamicMapEvents = dynamic(() => import('./DynamicMapEvents'), {
  ssr: false,
});

const MapEvents = ({ setLatLng }) => {
  return <DynamicMapEvents setLatLng={setLatLng} />;
};

export default MapEvents;
