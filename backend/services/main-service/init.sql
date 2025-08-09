
CREATE DATABASE gym_system;
\c gym_system;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    national_id VARCHAR(20),
    birthdate DATE,
    health_conditions TEXT,
    fitness_goals VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Nutrition plans
CREATE TABLE nutrition_weeks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, 
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE nutrition_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    week_id UUID REFERENCES nutrition_weeks(id) ON DELETE CASCADE,
    day_of_week VARCHAR(10) NOT NULL,

    breakfast TEXT,
    snack TEXT[],
    lunch TEXT,
    dinner TEXT,

    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
);


CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,  
    price DECIMAL(10,2)NOT NULL,
    session_count INTEGERNOT NULL,
    created_at TIMESTAMP DEFAULT now()
);



CREATE TABLE plan_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    session_count INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,                  
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- paid, pending, failed
    paid_at TIMESTAMP,
    payment_method VARCHAR(20) NOT ,                        
    created_at TIMESTAMP DEFAULT now()
);

