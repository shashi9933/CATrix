-- Seed data for CAT preparation platform

-- Insert admin profile
INSERT INTO profiles (id, full_name, role, created_at, updated_at)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Admin User',
    'admin',
    NOW(),
    NOW()
);

-- Insert test profiles
INSERT INTO profiles (id, full_name, role, created_at, updated_at)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Test User 1', 'user', NOW(), NOW()),
    ('22222222-2222-2222-2222-222222222222', 'Test User 2', 'user', NOW(), NOW());

-- Insert sample tests
INSERT INTO tests (id, title, description, duration_minutes, total_questions, total_marks, difficulty, section, topics, created_at, updated_at)
VALUES 
    (
        '33333333-3333-3333-3333-333333333333',
        'VARC Mock Test 1',
        'Comprehensive test covering Reading Comprehension and Verbal Ability',
        60,
        30,
        90,
        'Medium',
        'VARC',
        ARRAY['Reading Comprehension', 'Verbal Ability', 'Grammar'],
        NOW(),
        NOW()
    ),
    (
        '44444444-4444-4444-4444-444444444444',
        'DILR Practice Test',
        'Focus on Logical Reasoning and Data Interpretation',
        60,
        25,
        75,
        'Hard',
        'DILR',
        ARRAY['Logical Reasoning', 'Data Interpretation', 'Caselets'],
        NOW(),
        NOW()
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        'QA Section Test',
        'Quantitative Ability practice test',
        60,
        28,
        84,
        'Medium',
        'QA',
        ARRAY['Arithmetic', 'Algebra', 'Geometry'],
        NOW(),
        NOW()
    );

-- Insert sample questions
INSERT INTO questions (id, test_id, question_text, question_type, correct_answer, marks, section, options, created_at, updated_at)
VALUES 
    (
        '66666666-6666-6666-6666-666666666666',
        '33333333-3333-3333-3333-333333333333',
        'Read the following passage and answer the question: The rapid advancement of technology has transformed the way we live and work...',
        'MCQ',
        'A',
        3,
        'VARC',
        '[
            {"option_text": "Technology has only positive impacts", "option_letter": "A"},
            {"option_text": "Technology has only negative impacts", "option_letter": "B"},
            {"option_text": "Technology has both positive and negative impacts", "option_letter": "C"},
            {"option_text": "Technology has no significant impact", "option_letter": "D"}
        ]'::jsonb,
        NOW(),
        NOW()
    ),
    (
        '77777777-7777-7777-7777-777777777777',
        '44444444-4444-4444-4444-444444444444',
        'In a certain code language, if "CAT" is written as "DBU", how is "DOG" written?',
        'MCQ',
        'B',
        3,
        'DILR',
        '[
            {"option_text": "EPH", "option_letter": "A"},
            {"option_text": "EPI", "option_letter": "B"},
            {"option_text": "EPJ", "option_letter": "C"},
            {"option_text": "EPK", "option_letter": "D"}
        ]'::jsonb,
        NOW(),
        NOW()
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        '55555555-5555-5555-5555-555555555555',
        'If x + y = 10 and x - y = 4, what is the value of x?',
        'TITA',
        '7',
        3,
        'QA',
        NULL,
        NOW(),
        NOW()
    );

-- Insert study materials
INSERT INTO study_materials (id, title, description, content_type, content_url, section, topics, created_at, updated_at)
VALUES 
    (
        '99999999-9999-9999-9999-999999999999',
        'VARC Strategy Guide',
        'Comprehensive guide for Verbal Ability and Reading Comprehension',
        'pdf',
        'https://example.com/varc-guide.pdf',
        'VARC',
        ARRAY['Reading Comprehension', 'Verbal Ability'],
        NOW(),
        NOW()
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        'DILR Problem Solving Techniques',
        'Video series on solving Logical Reasoning problems',
        'video',
        'https://example.com/dilr-videos',
        'DILR',
        ARRAY['Logical Reasoning', 'Data Interpretation'],
        NOW(),
        NOW()
    );

-- Insert colleges
INSERT INTO colleges (id, name, location, cutoff_percentile, fees, average_placement, specializations, website, created_at, updated_at)
VALUES 
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        'IIM Ahmedabad',
        'Ahmedabad, Gujarat',
        99.5,
        '₹23,00,000',
        '₹32,00,000',
        ARRAY['Finance', 'Marketing', 'Operations'],
        'https://www.iima.ac.in',
        NOW(),
        NOW()
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        'IIM Bangalore',
        'Bangalore, Karnataka',
        99.0,
        '₹23,00,000',
        '₹30,00,000',
        ARRAY['Finance', 'Marketing', 'IT'],
        'https://www.iimb.ac.in',
        NOW(),
        NOW()
    );

-- Insert mentors
INSERT INTO mentors (id, name, specialization, experience_years, rating, availability, created_at, updated_at)
VALUES 
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        'Dr. Rajesh Kumar',
        'VARC Expert',
        15,
        4.9,
        '{"available_days": ["Monday", "Wednesday", "Friday"], "time_slots": ["10:00", "14:00", "16:00"]}'::jsonb,
        NOW(),
        NOW()
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        'Prof. Priya Sharma',
        'DILR Expert',
        12,
        4.8,
        '{"available_days": ["Tuesday", "Thursday", "Saturday"], "time_slots": ["11:00", "15:00", "17:00"]}'::jsonb,
        NOW(),
        NOW()
    );

-- Insert test attempts
INSERT INTO test_attempts (id, user_id, test_id, started_at, completed_at, score, status, created_at, updated_at)
VALUES 
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '11111111-1111-1111-1111-111111111111',
        '33333333-3333-3333-3333-333333333333',
        NOW() - INTERVAL '1 hour',
        NOW() - INTERVAL '30 minutes',
        75,
        'completed',
        NOW(),
        NOW()
    );

-- Insert question attempts
INSERT INTO question_attempts (id, test_attempt_id, question_id, selected_answer, time_taken_seconds, is_correct, created_at, updated_at)
VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '66666666-6666-6666-6666-666666666666',
        'A',
        120,
        true,
        NOW(),
        NOW()
    );

-- Insert user progress
INSERT INTO user_progress (id, user_id, section, topic, proficiency_level, last_practiced_at, created_at, updated_at)
VALUES 
    (
        '22222222-2222-2222-2222-222222222222',
        '11111111-1111-1111-1111-111111111111',
        'VARC',
        'Reading Comprehension',
        4,
        NOW(),
        NOW(),
        NOW()
    ); 