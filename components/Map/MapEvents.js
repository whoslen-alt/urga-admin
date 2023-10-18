import dynamic from 'next/dynamic';

const DynamicMapEvents = dynamic(() => import('./DynamicMapEvents'), {
  ssr: false,
});

const MapEvents = ({ setLatLng }) => {
  return (
    <div>
      <DynamicMapEvents setLatLng={setLatLng} />
    </div>
  );
};

export default MapEvents;
