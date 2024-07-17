import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function increment_column_by_question_id(question_id, column) {
    const { data, error } = await supabase
        .rpc('increment_column_by_question_id', {
            p_column: column,
            p_question_id: question_id
        })
    if (error) throw new Error(`Failed to increment column: ${error.message}`)
    return data
}
function report_question(question_id){
    increment_column_by_question_id(question_id, 'times_flagged_bad');
}

async function select_n_random_questions(n) {
    const { data, error } = await supabase
        .rpc('get_n_random_questions', { n })
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

async function get_random_quiz_data(n) {
    if (typeof n !== 'number' || n <= 0) {
        throw new Error('n must be a positive number')
    }
    const rows = await select_n_random_questions(n)
    return parseQuestions(rows)
}

export { increment_column_by_question_id, select_n_random_questions, get_random_quiz_data, report_question };