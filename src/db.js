import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


export async function initializeQuizSession(jlptLevel, numQuestions) {
    try {
        const { data, error } = await supabase.rpc('initialize_quiz_session_for_user', {
            p_jlpt_level: jlptLevel,
            p_num_questions: numQuestions
        });

        if (error) {
            throw new Error(`Failed to initialize quiz session: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error initializing quiz session:', error);
        throw error;
    }
}

export async function getLatestInProgressSession() {
    try {
        const { data, error } = await supabase.rpc('get_latest_in_progress_session');

        if (error) {
            throw new Error(`Failed to get latest in-progress session: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error getting latest in-progress session:', error);
        throw error;
    }
}

export async function getQuizSessionJson(quizSessionId) {
    if (!quizSessionId) {
        throw new Error('Quiz session ID is required');
    }

    try {
        const { data, error } = await supabase.rpc('get_quiz_session_json', {
            p_quiz_session_id: quizSessionId
        });

        if (error) {
            throw new Error(`Failed to get quiz session JSON: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error getting quiz session JSON:', error);
        throw error;
    }
}

export async function continueQuizSession() {
    try {
        const { data, error } = await supabase.rpc('continue_quiz_session_for_user');

        if (error) {
            throw new Error(`Failed to continue quiz session: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error continuing quiz session:', error);
        throw error;
    }
}

export async function updateQuizSessionAnswers(answers) {
    // [
    //     {
    //         "quizSessionAnswerId": "0a84a02e-c3f9-435b-82ef-ec6465b66d54",
    //         "userAnswer": {}
    //     },
    //     {
    //         "quizSessionAnswerId": "b5783661-7b19-40a1-9771-179f7e04baa2",
    //         "userAnswer": {}
    //     },...
    // ]
    if (!answers || !Array.isArray(answers)) {
        throw new Error('Answers must be provided as an array');
    }

    try {
        const { data, error } = await supabase.rpc('update_quiz_session_answers', {
            p_answers: answers
        });

        if (error) {
            throw new Error(`Failed to update quiz session answers: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error updating quiz session answers:', error);
        throw error;
    }
}

export async function submitQuizSession(quizSessionId) {
    if (!quizSessionId) {
        throw new Error('Quiz session ID is required');
    }

    try {
        const { data, error } = await supabase.rpc('submit_quiz_session', {
            p_quiz_session_id: quizSessionId
        });

        if (error) {
            throw new Error(`Failed to submit quiz session: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error submitting quiz session:', error);
        throw error;
    }
}

export async function setDisplayName(newDisplayName) {
    if (!newDisplayName) {
        throw new Error('New display name is required');
    }

    try {
        const { data, error } = await supabase.rpc('set_display_name', {
            p_new_display_name: newDisplayName
        });

        if (error) {
            throw new Error(`Failed to set display name: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error setting display name:', error);
        throw error;
    }
}

export async function getProfile(userId = null) {
    // userId = null will return the profile of the current authenticated user.
    try {
        const { data, error } = await supabase.rpc('get_profile', {
            p_user_id: userId
        });

        if (error) {
            throw new Error(`Failed to get profile: ${error.message}`);
        }

        return data;
    } catch (error) {
        console.error('Error getting profile:', error);
        throw error;
    }
}