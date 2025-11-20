-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create taxi tiers table
CREATE TABLE public.taxi_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_km DECIMAL(10, 2) NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  capacity INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for taxi tiers (public read)
ALTER TABLE public.taxi_tiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view taxi tiers"
  ON public.taxi_tiers FOR SELECT
  USING (true);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES public.taxi_tiers(id) NOT NULL,
  start_lat DECIMAL(10, 8) NOT NULL,
  start_lng DECIMAL(11, 8) NOT NULL,
  start_address TEXT NOT NULL,
  end_lat DECIMAL(10, 8) NOT NULL,
  end_lng DECIMAL(11, 8) NOT NULL,
  end_address TEXT NOT NULL,
  distance_km DECIMAL(10, 2) NOT NULL,
  fare DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_bookings
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert default taxi tiers
INSERT INTO public.taxi_tiers (name, description, price_per_km, base_price, capacity) VALUES
  ('Standard', 'Comfortable and economical flying taxi for everyday travel', 25.00, 100.00, 2),
  ('Premium', 'Enhanced comfort with premium amenities and faster routes', 40.00, 200.00, 3),
  ('Luxury', 'Ultimate luxury experience with VIP service and panoramic views', 75.00, 500.00, 4);