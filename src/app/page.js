'use client';

import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import Map from './components/Map/Map';
import { useMap } from 'react-leaflet';

const DEFAULT_CENTER = [38.907132, -77.036546];

async function getCurrentIp() {
  const res = await fetch('https://api.ipify.org?format=json');

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

async function getGeoIp({ ipAddress }) {
  const res = await fetch(
    `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.NEXT_PUBLIC_API_KEY}&ip=${ipAddress}`
  );

  if (!res.ok) {
    throw new Error('IP Address not found');
  }

  return res.json();
}

export default function Home() {
  const [ipAddress, setIpAddress] = useState(null);
  const [geo, setGeo] = useState(null);
  const [lat, setLat] = useState(38.907132);
  const [lng, setLng] = useState(-77.036546);

  useEffect(() => {
    async function checkIp() {
      if (!ipAddress) {
        const ip = await getCurrentIp();
        setIpAddress(ip.ip);

        if (ip) {
          try {
            const geo = await getGeoIp({ ipAddress: ip.ip });
            setGeo(geo);
            setLat(geo.latitude);
            setLng(geo.longitude);
          } catch (error) {
            alert(error.message);
          }
        }
      }
    }

    checkIp();
  }, [ipAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ipAddress) {
      alert('Please insert the IP Address');
    }

    try {
      const geo = await getGeoIp({ ipAddress });
      setGeo(geo);
      setLat(geo.latitude);
      setLng(geo.longitude);
    } catch (error) {
      alert(error.message);
    }
  };

  const UpdateMap = ({ lat, lng }) => {
    const map = useMap();

    map.setView([lat, lng]);
    return null;
  };

  return (
    <>
      <header className="w-full h-[37vh] px-6 py-8 bg-hero-mobile bg-no-repeat bg-cover text-center lg:bg-hero-desktop lg:h-[35vh]">
        <h1 className="font-medium text-2xl text-white lg:text-3xl">
          IP Address Tracker
        </h1>
        <form className="w-full mt-4 flex items-center justify-center lg:max-w-md lg:mx-auto lg:mt-6">
          <input
            type="text"
            id="ipaddress"
            name="ipaddress"
            placeholder="Search for any IP address or domain"
            className="w-full h-14 p-5 text-sm rounded-l-lg focus:outline-none lg:text-base"
            onChange={(e) => setIpAddress(e.target.value)}
            required
          />
          <button
            className="w-1/5 h-14 bg-black rounded-r-lg hover:bg-slate-800 lg:w-[15%]"
            onClick={handleSubmit}
          >
            <IoIosArrowForward className="m-auto text-white text-lg font-bold" />
          </button>
        </form>
      </header>
      <main>
        <div className="absolute top-40 left-0 right-0 mx-6 px-4 py-6 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-center z-50 lg:top-44 lg:flex-row lg:justify-between lg:text-start lg:px-10 lg:max-w-5xl lg:mx-auto lg:gap-0 xl:max-w-6xl">
          <div className="lg:w-1/4 lg:px-4 lg:border-r">
            <h2 className="box-title">ip address</h2>
            <p className="box-item">{geo ? geo.ip : 'Not Available'}</p>
          </div>
          <div className="lg:w-1/4 lg:px-4 lg:border-r">
            <h2 className="box-title">location</h2>
            <p className="box-item">
              {geo ? `${geo.city}, ${geo.country_name}` : 'Not Available'}
            </p>
          </div>
          <div className="lg:w-1/4 lg:px-4 lg:border-r">
            <h2 className="box-title">timezone</h2>
            <p className="box-item">
              {geo
                ? `UTC ${Math.sign(geo.time_zone.offset) === 1 && '+'}${
                    geo.time_zone.offset
                  }`
                : 'Not Available'}
            </p>
          </div>
          <div className="lg:w-1/4 lg:px-4">
            <h2 className="box-title">isp</h2>
            <p className="box-item">{geo ? geo.isp : 'Not Available'}</p>
          </div>
        </div>
        <Map
          className="h-[63vh] z-10 lg:h-[65vh]"
          width="800"
          height="400"
          center={DEFAULT_CENTER}
          zoom={12}
          scrollWheelZoom={false}
          zoomControl={false}
        >
          {({ TileLayer, Marker, Popup }) => (
            <>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {geo && (
                <Marker position={[lat, lng]}>
                  <Popup>IP Address: {geo.ip}</Popup>
                </Marker>
              )}
              <UpdateMap lat={lat} lng={lng} />
            </>
          )}
        </Map>
      </main>
    </>
  );
}
