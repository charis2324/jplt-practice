import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function update_user_quiz_answer(p_question_id, p_quiz_session_id, p_user_answer) {
    let { _, error } = await supabase
        .rpc('update_quiz_session_response', {
            p_question_id,
            p_quiz_session_id,
            p_user_answer
        })
    if (error) console.error(error)
}
async function get_user_profile(p_user_id) {
    let { data, error } = await supabase
        .rpc('get_user_profile', {
            p_user_id
        })
    if (error) {
        console.error(error)
        return null;
    }
    else {
        return data
    }
}
async function update_user_profile(p_profile_data, p_user_id) {
    let { data, error } = await supabase
        .rpc('update_user_profile', {
            p_profile_data,
            p_user_id
        })
    if (error) {
        console.error(error)
    }
    return { data, error }
}
async function increment_column_by_question_id(question_id, column) {
    const { data, error } = await supabase
        .rpc('increment_column_by_question_id', {
            p_column: column,
            p_question_id: question_id
        })
    if (error) throw new Error(`Failed to increment column: ${error.message}`)
    return data
}
async function report_question(p_quiz_session_id, p_question_id) {
    let { data, error } = await supabase.rpc('report_quiz_session_question', {
        p_question_id,
        p_quiz_session_id
    })
    if (error) console.error(error)
    console.log(data)
    return data;
}
async function has_quiz_in_progress(p_user_id) {
    let { data, error } = await supabase
        .rpc('get_user_latest_in_progress_quiz_session_id', {
            p_user_id
        })
    if (error) {
        console.error(error);
        return false;
    }
    return !!data;
}
function report_answered_incorrectly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_incorrectly');
}
function report_answered_correctly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_correctly');
}
function parseQuizData(quizData) {
    const inputArray = quizData.quiz_details
    return {
        session_id: quizData.session_id,
        quiz_id: quizData.quiz_id,
        jlpt_level: quizData.jlpt_level,
        questions: inputArray.map((item, index) => ({
            id: item.id, // Use the original question_id instead of index
            question: item.question_text,
            options: {
                A: item.option_a,
                B: item.option_b,
                C: item.option_c,
                D: item.option_d
            },
            correctAnswer: item.correct_answer
        })),
        session_responses: quizData.session_responses
    };
}

async function get_new_quiz(n, input_jlpt_level, user_id) {
    if (typeof n !== 'number' || n <= 0) {
        throw new Error('n must be a positive number')
    }
    if (!typeof input_jlpt_level === 'number' || input_jlpt_level < 1 && input_jlpt_level > 5) {
        throw new Error('input_jlpt_level must be 1 ~ 5')
    }
    let { data, error } = await supabase
        .rpc('start_new_quiz', {
            p_jlpt_level: input_jlpt_level,
            p_num_questions: n,
            p_user_id: user_id
        })
    if (error) throw new Error(`Failed to fetch new quiz: ${error.message}`)
    return parseQuizData(data);
}
async function get_in_progress_quiz(user_id) {
    let { data, error } = await supabase
        .rpc('continue_in_progress_quiz', {
            p_user_id: user_id
        })
    if (error) throw new Error(`Failed to fetch in-progress quiz: ${error.message}`)
    return parseQuizData(data);
}
async function submit_user_quiz_answers(p_quiz_session_id, p_session_responses) {

    const { data, error } = await supabase.rpc('submit_quiz_session', {
        p_quiz_session_id,
        p_session_responses
    });
    if (error) throw new Error(`Failed to submit quiz: ${error.message}`)
    return data;
}
export { submit_user_quiz_answers, get_in_progress_quiz, has_quiz_in_progress, update_user_quiz_answer, get_user_profile, update_user_profile, increment_column_by_question_id, get_new_quiz, report_question, report_answered_incorrectly, report_answered_correctly, supabase };