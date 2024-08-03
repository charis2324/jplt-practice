import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function get_user_profile(user_id) {
    let { data, error } = await supabase
        .rpc('get_user_profile', {
            user_id
        })
    if (error) {
        console.error(error)
        return null;
    }
    else {
        return data
    }
}
async function update_user_profile(updated_fields, user_id) {
    let { data, error } = await supabase
        .rpc('update_user_profile', {
            updated_fields,
            user_id
        })
    if (error) {
        console.error(error)
    }
    return {data, error}
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
function report_question(question_id) {
    increment_column_by_question_id(question_id, 'times_flagged_bad');
}
function report_answered_incorrectly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_incorrectly');
}
function report_answered_correctly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_correctly');
}
async function select_n_random_questions(n, input_jlpt_level = null) {
    const { data, error } = await supabase
        .rpc('get_n_random_questions', { n, input_jlpt_level })
    if (error) throw new Error(`Failed to select random questions: ${error.message}`)
    return data
}

function parseQuestions(inputArray) {
    if (!Array.isArray(inputArray)) {
        throw new Error('Input must be an array')
    }
    return {
        questions: inputArray.map((item, index) => ({
            id: item.question_id, // Use the original question_id instead of index
            question: {
                japanese: item.question_japanese
            },
            options: {
                A: item.option_a,
                B: item.option_b,
                C: item.option_c,
                D: item.option_d
            },
            correctAnswer: item.correct_answer
        }))
    };
}

async function get_random_quiz_data(n, input_jlpt_level = null) {
    if (typeof n !== 'number' || n <= 0) {
        throw new Error('n must be a positive number')
    }
    if (typeof input_jlpt_level !== 'number' && input_jlpt_level !== null) {
        throw new Error('input_jlpt_level must be a positive number or null')
    }
    if (typeof input_jlpt_level === 'number' && input_jlpt_level < 1 && input_jlpt_level > 5) {
        throw new Error('input_jlpt_level must be 1 ~ 5')
    }
    const rows = await select_n_random_questions(n, input_jlpt_level)
    return parseQuestions(rows)
}

export { get_user_profile, update_user_profile, increment_column_by_question_id, select_n_random_questions, get_random_quiz_data, report_question, report_answered_incorrectly, report_answered_correctly, supabase };