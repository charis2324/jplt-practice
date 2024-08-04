import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function update_user_quiz_answer(p_history_id, p_question_id, p_user_answer, p_user_id){
    let { _, error } = await supabase
    .rpc('update_user_quiz_answer', {
      p_history_id, 
      p_question_id, 
      p_user_answer, 
      p_user_id
    })
    if (error) console.error(error)
}
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
async function report_question(p_history_id, p_question_id, p_user_id) {    
    let { data, error } = await supabase.rpc('report_low_quality_question', {
                            p_history_id, 
                            p_question_id, 
                            p_user_id
                            })
    if (error) console.error(error)
    console.log(data)
    return data;
}
function report_answered_incorrectly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_incorrectly');
}
function report_answered_correctly(question_id) {
    increment_column_by_question_id(question_id, 'times_answered_correctly');
}
function parseQuizData(quizData) {
    const inputArray = quizData.question_set.questions
    return {
        history_id: quizData.history_id,
        set_id: quizData.question_set.set_id,
        jlpt_level: quizData.question_set.jlpt_level,
        questions: inputArray.map((item, index) => ({
            id: item.question_id, // Use the original question_id instead of index
            question: item.question_japanese,
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

async function get_new_quiz(n, input_jlpt_level, user_id) {
    if (typeof n !== 'number' || n <= 0) {
        throw new Error('n must be a positive number')
    }
    if (!typeof input_jlpt_level === 'number' || input_jlpt_level < 1 && input_jlpt_level > 5) {
        throw new Error('input_jlpt_level must be 1 ~ 5')
    }
    let { data, error } = await supabase
        .rpc('get_new_quiz', {
            p_jlpt_level: input_jlpt_level,
            p_set_size: n,
            p_user_id: user_id
        })
    if (error) throw new Error(`Failed to select random questions: ${error.message}`)
    return parseQuizData(data);
}

export { update_user_quiz_answer, get_user_profile, update_user_profile, increment_column_by_question_id, get_new_quiz, report_question, report_answered_incorrectly, report_answered_correctly, supabase };