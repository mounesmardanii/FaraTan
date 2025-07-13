
CREATE DATABASE gym_system;
\c gym_system;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admins table
CREATE TABLE admins (
    admin_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION update_member_age()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.birthdate IS NOT NULL THEN
        NEW.age := DATE_PART('year', AGE(NEW.birthdate));
    ELSE
        NEW.age := NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_update_member_age
BEFORE INSERT OR UPDATE ON member_profiles
FOR EACH ROW
EXECUTE FUNCTION update_member_age();

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
    profile_image VARCHAR(255)
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
    full_name VARCHAR(100),
    phone_number VARCHAR(20),
    gender VARCHAR(10),
    bio TEXT,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_image VARCHAR(255)
);

-- Exercises
CREATE TABLE exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training plans
CREATE TABLE training_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
    title VARCHAR(100),
    goal VARCHAR(100),
    start_date DATE,
    end_date DATE,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);


-- Session exercises
CREATE TABLE session_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    training_plan_id UUID REFERENCES training_plans(id) ON DELETE CASCADE,
    exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
    sets INT,
    reps INT,
    weight FLOAT,
    duration VARCHAR(50)
);

-- Nutrition plans
CREATE TABLE nutrition_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    meal_type VARCHAR(50),
    calories INT,
    protein FLOAT,
    carbs FLOAT,
    fats FLOAT,
    meal_plan_description TEXT,
    start_date DATE,
    end_date DATE,
    version INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);


-- Classes
CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100),
    trainer_id UUID REFERENCES trainers(id) ON DELETE CASCADE,
    class_time TIMESTAMP,
    capacity INT CHECK (capacity > 0),
    remaining_capacity INT CHECK (remaining_capacity >= 0 AND remaining_capacity <= capacity)
);


-- Class reservations
CREATE TABLE class_reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    reservation_time TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10,2),
    transaction_id VARCHAR(100),
    payment_status VARCHAR(50)
);

-- Subscription types
CREATE TABLE subscription_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50),
    duration INT,
    price DECIMAL(10,2)
);

-- User subscriptions
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    subscription_type_id UUID REFERENCES subscription_types(id),
    start_date DATE,
    end_date DATE,
    last_renewal DATE
);

-- Attendance logs
CREATE TABLE attendance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE CASCADE,
    datetime TIMESTAMP,
    method VARCHAR(50),
    status VARCHAR(20),
    device_id VARCHAR(100)
);


CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_url VARCHAR(255) NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('vip', 'basic')),
    exercise_id UUID NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE trainers
ADD COLUMN years_of_experience INT,
ADD COLUMN biography TEXT,
ADD COLUMN age INT;



CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);


