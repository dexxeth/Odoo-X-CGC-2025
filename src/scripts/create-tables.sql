-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'agent', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE ticket_status AS ENUM ('open', 'in-progress', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'active',
    avatar_url TEXT,
    phone VARCHAR(50),
    location VARCHAR(255),
    bio TEXT,
    company VARCHAR(255),
    department VARCHAR(255),
    permissions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(50) DEFAULT 'blue',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_number VARCHAR(20) UNIQUE NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    category_id UUID REFERENCES categories(id),
    customer_id UUID REFERENCES users(id) NOT NULL,
    assigned_to UUID REFERENCES users(id),
    tags TEXT[],
    attachments TEXT[],
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Replies table
CREATE TABLE IF NOT EXISTS replies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL,
    attachments TEXT[],
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    vote_type VARCHAR(10) CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(ticket_id, user_id)
);

-- User stats table
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tickets_created INTEGER DEFAULT 0,
    tickets_resolved INTEGER DEFAULT 0,
    avg_response_time DECIMAL(10,2) DEFAULT 0,
    customer_rating DECIMAL(3,2) DEFAULT 0,
    total_replies INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_tickets_customer_id ON tickets(customer_id);
CREATE INDEX idx_tickets_assigned_to ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_created_at ON tickets(created_at);
CREATE INDEX idx_replies_ticket_id ON replies(ticket_id);
CREATE INDEX idx_replies_author_id ON replies(author_id);
CREATE INDEX idx_votes_ticket_id ON votes(ticket_id);
CREATE INDEX idx_votes_user_id ON votes(user_id);

-- Create functions for automatic ticket numbering
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ticket_number := 'T-' || LPAD(nextval('ticket_number_seq')::TEXT, 6, '0');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create sequence for ticket numbers
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1;

-- Create trigger for automatic ticket numbering
CREATE TRIGGER set_ticket_number
    BEFORE INSERT ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_replies_updated_at BEFORE UPDATE ON replies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update ticket votes count
CREATE OR REPLACE FUNCTION update_ticket_votes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'up' THEN
            UPDATE tickets SET upvotes = upvotes + 1 WHERE id = NEW.ticket_id;
        ELSE
            UPDATE tickets SET downvotes = downvotes + 1 WHERE id = NEW.ticket_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'up' AND NEW.vote_type = 'down' THEN
            UPDATE tickets SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.ticket_id;
        ELSIF OLD.vote_type = 'down' AND NEW.vote_type = 'up' THEN
            UPDATE tickets SET upvotes = upvotes + 1, downvotes = downvotes - 1 WHERE id = NEW.ticket_id;
        END IF;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'up' THEN
            UPDATE tickets SET upvotes = upvotes - 1 WHERE id = OLD.ticket_id;
        ELSE
            UPDATE tickets SET downvotes = downvotes - 1 WHERE id = OLD.ticket_id;
        END IF;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote updates
CREATE TRIGGER update_ticket_votes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON votes
    FOR EACH ROW EXECUTE FUNCTION update_ticket_votes();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can manage users" ON users FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role = 'admin'
    )
);

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage categories" ON categories FOR ALL USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
);

-- RLS Policies for tickets
CREATE POLICY "Users can view own tickets" ON tickets FOR SELECT USING (
    customer_id = auth.uid() OR 
    assigned_to = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
);

CREATE POLICY "Users can create tickets" ON tickets FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Users can update own tickets" ON tickets FOR UPDATE USING (
    customer_id = auth.uid() OR 
    assigned_to = auth.uid() OR
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
);

-- RLS Policies for replies
CREATE POLICY "Users can view replies for accessible tickets" ON replies FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM tickets t 
        WHERE t.id = ticket_id AND (
            t.customer_id = auth.uid() OR 
            t.assigned_to = auth.uid() OR
            EXISTS (
                SELECT 1 FROM users 
                WHERE id = auth.uid() AND role IN ('admin', 'agent')
            )
        )
    )
);

CREATE POLICY "Users can create replies" ON replies FOR INSERT WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM tickets t 
        WHERE t.id = ticket_id AND (
            t.customer_id = auth.uid() OR 
            t.assigned_to = auth.uid() OR
            EXISTS (
                SELECT 1 FROM users 
                WHERE id = auth.uid() AND role IN ('admin', 'agent')
            )
        )
    )
);

-- RLS Policies for votes
CREATE POLICY "Users can manage own votes" ON votes FOR ALL USING (user_id = auth.uid());

-- RLS Policies for user_stats
CREATE POLICY "Users can view own stats" ON user_stats FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Agents and admins can view all stats" ON user_stats FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() AND role IN ('admin', 'agent')
    )
);
