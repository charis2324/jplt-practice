import { createClient } from '@supabase/supabase-js'

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY)

async function increment_column_by_question_id(question_id, column) {
    let { data, error } = await supabase
        .rpc('increment_column_by_question_id', {
            p_column: column,
            p_question_id: question_id
        })
    if (error) console.error(error)
    return data
}

async function select_n_random_questions(n) {
    try {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('RANDOM()')
            .limit(n)

        if (error) throw error

        return data
    } catch (error) {
        console.error('Error fetching random data:', error)
        return null
    }
}

export { increment_column_by_question_id, select_n_random_questions };