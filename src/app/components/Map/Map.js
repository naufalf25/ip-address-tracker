'use client';

const { default: dynamic } = require('next/dynamic');

const DynamicMap = dynamic(() => import('./DynamicMap'), {
  ssr: false,
});

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

const Map = (props) => {
  return (
    <div>
      <DynamicMap {...props} />
    </div>
  );
};

export default Map;
