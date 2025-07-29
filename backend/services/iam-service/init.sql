
CREATE DATABASE gym_system;
\c gym_system;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    can_reset_password BOOLEAN DEFAULT FALSE
);

-- Members table
CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    national_id VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    can_reset_password BOOLEAN NOT NULL DEFAULT FALSE,
    profile_image Text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Member profiles
CREATE TABLE member_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    height FLOAT,
    gender VARCHAR(10),
    birthdate DATE,
    age INT,
    health_conditions TEXT,
    fitness_goals VARCHAR(100),
    profile_image Text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE body_measurements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    bmi FLOAT,
    weight FLOAT,
    waist_circumference FLOAT,
    hip_circumference FLOAT,
    arm_circumference FLOAT,
    chest_circumference FLOAT,
    thigh_circumference FLOAT,
    needs_update BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE body_measurements_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    bmi FLOAT,
    weight FLOAT,
    waist_circumference FLOAT,
    hip_circumference FLOAT,
    arm_circumference FLOAT,
    chest_circumference FLOAT,
    thigh_circumference FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trainers table
CREATE TABLE trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    phone_number VARCHAR UNIQUE NOT NULL,
    specialty VARCHAR NOT NULL,
    birth_date DATE NOT NULL,
    age INT,
    years_of_experience INT,
    start_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image VARCHAR(255) 
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
    created_at TIMESTAMP DEFAULT now()
);

INSERT INTO plans (name)
VALUES 
('VIP'),
('خصوصی'),
('عمومی');


CREATE TABLE plan_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
    coach_id UUID NOT NULL REFERENCES coaches(id) ON DELETE SET NULL,
    capacity INTEGER NOT NULL,
    session_count INTEGER NOT NULL,
    price INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE plan_purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES plan_sessions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,                  
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- paid, pending, failed
    paid_at TIMESTAMP,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'online'                         
    created_at TIMESTAMP DEFAULT now()
);


CREATE TABLE gym_sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT now()
);

INSERT INTO gym_sports (name)
VALUES ('بدنسازی');


CREATE TABLE session_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES plan_sessions(id) ON DELETE CASCADE,
    sport_id UUID NOT NULL REFERENCES gym_sports(id) ON DELETE RESTRICT,
    weekday DATE NOT NULL, 
    capacity INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES plan_sessions(id) ON DELETE CASCADE,
    reserved_at TIMESTAMP DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'Reserved' -- Reserved | Cancelled | Attended (اختیاری)
);
ALTER TABLE reservations
ADD COLUMN session_schedule_id UUID NOT NULL REFERENCES session_schedules(id) ON DELETE CASCADE;


CREATE TABLE movements (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL, 
    video_url TEXT,
    is_vip BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE program_movements (
    id UUID PRIMARY KEY,
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    movement_id UUID REFERENCES movements(id) ON DELETE CASCADE,
    duration INTEGER,
    sets INTEGER,
    reps INTEGER,
    weight NUMERIC(5,2),
    UNIQUE (member_id, movement_id)
);
