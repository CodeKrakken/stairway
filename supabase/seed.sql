insert into public.organisations (id, name)
values
  ('11111111-1111-1111-1111-111111111111', 'Northstar Property Group'),
  ('22222222-2222-2222-2222-222222222222', 'Harbour Homes');

insert into public.users (id, organisation_id, name, email, role)
values
  ('11111111-1111-1111-1111-111111111112', '11111111-1111-1111-1111-111111111111', 'Alex Morgan', 'alex.morgan@northstar.example', 'admin'),
  ('11111111-1111-1111-1111-111111111113', '11111111-1111-1111-1111-111111111111', 'Jamie Lee', 'jamie.lee@northstar.example', 'member'),
  ('22222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Taylor Smith', 'taylor.smith@harbour.example', 'admin'),
  ('22222222-2222-2222-2222-222222222224', '22222222-2222-2222-2222-222222222222', 'Morgan Patel', 'morgan.patel@harbour.example', 'member');

insert into public.properties (id, organisation_id, name, address)
values
  ('11111111-1111-1111-1111-111111111121', '11111111-1111-1111-1111-111111111111', 'Maple Court', '12 Maple Street, Leeds'),
  ('11111111-1111-1111-1111-111111111122', '11111111-1111-1111-1111-111111111111', 'Riverside House', '8 Riverside Road, Leeds'),
  ('22222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Harbour View', '24 Dock Lane, Bristol'),
  ('22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Cedar Apartments', '3 Cedar Avenue, Bristol');

insert into public.maintenance_requests (
  id,
  organisation_id,
  property_id,
  created_by_id,
  title,
  description,
  status,
  priority
)
values
  ('11111111-1111-1111-1111-111111111131', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111121', '11111111-1111-1111-1111-111111111113', 'Leaking kitchen tap', 'The kitchen tap is leaking from the base.', 'open', 'medium'),
  ('11111111-1111-1111-1111-111111111132', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111122', '11111111-1111-1111-1111-111111111112', 'Broken entry light', 'The light above the main entrance is not working.', 'in_progress', 'high'),
  ('22222222-2222-2222-2222-222222222231', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222224', 'Heating inspection', 'The heating system needs an inspection before winter.', 'open', 'high'),
  ('22222222-2222-2222-2222-222222222232', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222223', 'Window latch repair', 'A bedroom window latch is loose.', 'resolved', 'low');