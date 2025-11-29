import { useState } from 'react';
import { createRide } from '../services/rideService';

export default function RideForm() {
  const [form, setForm] = useState({
    name: '',
    source: '',
    destination: '',
    distance: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple fare calculation: 50 base + 20 per km
    const distance = parseFloat(form.distance);
    const fare = 50 + distance * 20;

    const { error } = await createRide({
      ...form,
      distance,
      fare,
    });

    if (error) {
      alert("Failed to save ride");
      console.error(error);
    } else {
      alert("Ride saved successfully!");
      setForm({ name: '', source: '', destination: '', distance: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
      <input name="source" placeholder="Pickup Location" value={form.source} onChange={handleChange} required />
      <input name="destination" placeholder="Drop Location" value={form.destination} onChange={handleChange} required />
      <input name="distance" placeholder="Distance (km)" value={form.distance} onChange={handleChange} required />

      <button type="submit">Submit Ride</button>
    </form>
  );
}

