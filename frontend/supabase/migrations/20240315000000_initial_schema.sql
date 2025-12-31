-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    avatar_url text,
    role text check (role in ('user', 'editor', 'admin')) default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tests table
create table tests (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    duration_minutes integer not null,
    total_questions integer not null,
    total_marks integer not null,
    difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')) not null,
    section text check (section in ('VARC', 'DILR', 'QA')) not null,
    topics text[] default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create questions table
create table questions (
    id uuid default uuid_generate_v4() primary key,
    test_id uuid references tests on delete cascade not null,
    question_text text not null,
    question_type text check (question_type in ('MCQ', 'TITA')) not null,
    correct_answer text not null,
    marks integer not null,
    section text check (section in ('VARC', 'DILR', 'QA')) not null,
    options jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create test_attempts table
create table test_attempts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles on delete cascade not null,
    test_id uuid references tests on delete cascade not null,
    started_at timestamp with time zone default timezone('utc'::text, now()) not null,
    completed_at timestamp with time zone,
    score integer,
    status text check (status in ('in_progress', 'completed', 'abandoned')) default 'in_progress',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create question_attempts table
create table question_attempts (
    id uuid default uuid_generate_v4() primary key,
    test_attempt_id uuid references test_attempts on delete cascade not null,
    question_id uuid references questions on delete cascade not null,
    selected_answer text,
    time_taken_seconds integer,
    is_correct boolean,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create study_materials table
create table study_materials (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text,
    content_type text check (content_type in ('pdf', 'video', 'article', 'quiz')) not null,
    content_url text,
    section text check (section in ('VARC', 'DILR', 'QA')) not null,
    topics text[] default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create colleges table
create table colleges (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    location text not null,
    cutoff_percentile numeric,
    fees text,
    average_placement text,
    specializations text[] default '{}',
    website text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create mentors table
create table mentors (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    specialization text not null,
    experience_years integer not null,
    rating numeric,
    availability jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create consultations table
create table consultations (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles on delete cascade not null,
    mentor_id uuid references mentors on delete cascade not null,
    scheduled_at timestamp with time zone not null,
    duration_minutes integer not null,
    status text check (status in ('scheduled', 'completed', 'cancelled')) default 'scheduled',
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user_progress table
create table user_progress (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references profiles on delete cascade not null,
    section text check (section in ('VARC', 'DILR', 'QA')) not null,
    topic text not null,
    proficiency_level integer check (proficiency_level between 1 and 5) not null,
    last_practiced_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_questions_test_id on questions(test_id);
create index idx_test_attempts_user_id on test_attempts(user_id);
create index idx_test_attempts_test_id on test_attempts(test_id);
create index idx_question_attempts_test_attempt_id on question_attempts(test_attempt_id);
create index idx_question_attempts_question_id on question_attempts(question_id);
create index idx_study_materials_section on study_materials(section);
create index idx_colleges_cutoff on colleges(cutoff_percentile);
create index idx_mentors_specialization on mentors(specialization);
create index idx_consultations_user_id on consultations(user_id);
create index idx_consultations_mentor_id on consultations(mentor_id);
create index idx_user_progress_user_id on user_progress(user_id);
create index idx_user_progress_section on user_progress(section);

-- Create RLS policies
alter table profiles enable row level security;
alter table tests enable row level security;
alter table questions enable row level security;
alter table test_attempts enable row level security;
alter table question_attempts enable row level security;
alter table study_materials enable row level security;
alter table colleges enable row level security;
alter table mentors enable row level security;
alter table consultations enable row level security;
alter table user_progress enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
    on profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on profiles for update
    using (auth.uid() = id);

-- Tests policies
create policy "Anyone can view tests"
    on tests for select
    to authenticated
    using (true);

create policy "Only admins can create tests"
    on tests for insert
    to authenticated
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Questions policies
create policy "Anyone can view questions"
    on questions for select
    to authenticated
    using (true);

create policy "Only admins can create questions"
    on questions for insert
    to authenticated
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Test attempts policies
create policy "Users can view their own test attempts"
    on test_attempts for select
    to authenticated
    using (user_id = auth.uid());

create policy "Users can create their own test attempts"
    on test_attempts for insert
    to authenticated
    with check (user_id = auth.uid());

-- Question attempts policies
create policy "Users can view their own question attempts"
    on question_attempts for select
    to authenticated
    using (exists (select 1 from test_attempts where id = question_attempts.test_attempt_id and user_id = auth.uid()));

create policy "Users can create their own question attempts"
    on question_attempts for insert
    to authenticated
    with check (exists (select 1 from test_attempts where id = question_attempts.test_attempt_id and user_id = auth.uid()));

-- Study materials policies
create policy "Anyone can view study materials"
    on study_materials for select
    to authenticated
    using (true);

create policy "Only admins can create study materials"
    on study_materials for insert
    to authenticated
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Colleges policies
create policy "Anyone can view colleges"
    on colleges for select
    to authenticated
    using (true);

create policy "Only admins can create colleges"
    on colleges for insert
    to authenticated
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Mentors policies
create policy "Anyone can view mentors"
    on mentors for select
    to authenticated
    using (true);

create policy "Only admins can create mentors"
    on mentors for insert
    to authenticated
    using (exists (select 1 from profiles where id = auth.uid() and role = 'admin'));

-- Consultations policies
create policy "Users can view their own consultations"
    on consultations for select
    to authenticated
    using (user_id = auth.uid());

create policy "Users can create their own consultations"
    on consultations for insert
    to authenticated
    with check (user_id = auth.uid());

-- User progress policies
create policy "Users can view their own progress"
    on user_progress for select
    to authenticated
    using (user_id = auth.uid());

create policy "Users can create their own progress"
    on user_progress for insert
    to authenticated
    with check (user_id = auth.uid());

-- Create functions for updating timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updating timestamps
create trigger update_profiles_updated_at
    before update on profiles
    for each row
    execute function update_updated_at_column();

create trigger update_tests_updated_at
    before update on tests
    for each row
    execute function update_updated_at_column();

create trigger update_questions_updated_at
    before update on questions
    for each row
    execute function update_updated_at_column();

create trigger update_test_attempts_updated_at
    before update on test_attempts
    for each row
    execute function update_updated_at_column();

create trigger update_question_attempts_updated_at
    before update on question_attempts
    for each row
    execute function update_updated_at_column();

create trigger update_study_materials_updated_at
    before update on study_materials
    for each row
    execute function update_updated_at_column();

create trigger update_colleges_updated_at
    before update on colleges
    for each row
    execute function update_updated_at_column();

create trigger update_mentors_updated_at
    before update on mentors
    for each row
    execute function update_updated_at_column();

create trigger update_consultations_updated_at
    before update on consultations
    for each row
    execute function update_updated_at_column();

create trigger update_user_progress_updated_at
    before update on user_progress
    for each row
    execute function update_updated_at_column(); 