import { useEffect, useState } from "react";
import { getLatestRide } from "../services/rideService";

export default function LatestRide() {
  const [ride, setRide] = useState(null);

  useEffect(() => {
    async function fetchRide() {
      const { data } = await getLatestRide();
      setRide(data);
    }
    fetchRide();
  }, []);

  if (!ride) return <p>No rides found.</p>;

  return (
    <div>
      <h3>Latest Ride</h3>
      <p>Name: {ride.name}</p>
      <p>From: {ride.source}</p>
      <p>To: {ride.destination}</p>
      <p>Distance: {ride.distance} km</p>
      <p>Fare: ₹{ride.fare}</p>
    </div>
  );
}

