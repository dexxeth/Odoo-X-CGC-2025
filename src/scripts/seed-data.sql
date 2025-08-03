-- Insert default categories
INSERT INTO categories (id, name, description, color) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Technical', 'Technical issues and bugs', 'blue'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Account', 'Account and login related issues', 'green'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Billing', 'Billing and payment issues', 'orange'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Feature Request', 'New feature requests', 'purple'),
  ('550e8400-e29b-41d4-a716-446655440005', 'General', 'General inquiries', 'gray')
ON CONFLICT (name) DO NOTHING;

-- Insert demo users
INSERT INTO users (id, email, name, role, status, company, department, bio) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', 'admin@quickdesk.com', 'Michael Chen', 'admin', 'active', 'QuickDesk Inc', 'IT Administration', 'System Administrator with 10+ years of experience'),
  ('550e8400-e29b-41d4-a716-446655440011', 'agent@quickdesk.com', 'Sarah Johnson', 'agent', 'active', 'QuickDesk Inc', 'Customer Support', 'Senior Support Agent specializing in technical issues'),
  ('550e8400-e29b-41d4-a716-446655440012', 'user@quickdesk.com', 'John Doe', 'user', 'active', 'Tech Corp', 'Engineering', 'Software Developer'),
  ('550e8400-e29b-41d4-a716-446655440013', 'jane@example.com', 'Jane Smith', 'user', 'active', 'Design Studio', 'Design', 'UI/UX Designer'),
  ('550e8400-e29b-41d4-a716-446655440014', 'mike@example.com', 'Mike Wilson', 'user', 'active', 'StartupXYZ', 'Marketing', 'Marketing Manager')
ON CONFLICT (email) DO NOTHING;

-- Insert demo tickets
INSERT INTO tickets (id, subject, description, status, priority, category_id, customer_id, assigned_to) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440020',
    'Unable to login to dashboard',
    'I am experiencing issues logging into my account. After entering my credentials, the page just refreshes without any error message. I have tried clearing my browser cache and using different browsers, but the issue persists.',
    'open',
    'high',
    '550e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440012',
    '550e8400-e29b-41d4-a716-446655440011'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440021',
    'Feature Request: Dark Mode',
    'It would be great to have a dark mode option for the dashboard. Many users work in low-light environments and would benefit from a darker theme.',
    'open',
    'low',
    '550e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440013',
    NULL
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    'Billing discrepancy in latest invoice',
    'I noticed an error in my latest invoice. The amount charged does not match what was agreed upon in our contract. Please review and correct this.',
    'in-progress',
    'medium',
    '550e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440014',
    '550e8400-e29b-41d4-a716-446655440011'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert demo replies
INSERT INTO replies (ticket_id, author_id, message) VALUES
  (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440011',
    'Hi John, thank you for reporting this issue. I can see that you are having trouble with the login process. Let me investigate this for you. Can you please try the following steps:

1. Clear your browser cookies specifically for our domain
2. Try logging in using an incognito/private browsing window
3. Let me know what browser and version you are using

I will also check our server logs for any authentication errors on your account.'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440020',
    '550e8400-e29b-41d4-a716-446655440012',
    'Hi Sarah, I tried the steps you mentioned:

1. ✅ Cleared cookies - still having the issue
2. ✅ Tried incognito mode - same problem  
3. I am using Chrome Version 120.0.6099.109

The issue persists across all attempts. Is there anything else I can try?'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440022',
    '550e8400-e29b-41d4-a716-446655440011',
    'Hi Mike, I have reviewed your account and invoice. I can see the discrepancy you mentioned. This appears to be a billing system error that affected a few accounts. I am escalating this to our billing department for immediate correction. You should see the corrected invoice within 24 hours, and any overcharge will be refunded to your account.'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert user stats
INSERT INTO user_stats (user_id, tickets_created, tickets_resolved, avg_response_time, customer_rating, total_replies) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 0, 342, 2.4, 4.8, 1250),
  ('550e8400-e29b-41d4-a716-446655440012', 3, 0, 0, 0, 5),
  ('550e8400-e29b-41d4-a716-446655440013', 1, 0, 0, 0, 0),
  ('550e8400-e29b-41d4-a716-446655440014', 1, 0, 0, 0, 1)
ON CONFLICT (user_id) DO NOTHING;
